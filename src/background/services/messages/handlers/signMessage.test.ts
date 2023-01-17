import { DAppRequestHandler } from '@src/background/connections/dAppConnection/DAppRequestHandler';
import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { DEFERRED_RESPONSE } from '@src/background/connections/middlewares/models';
import { ethErrors } from 'eth-rpc-errors';
import { WalletType } from '../../wallet/models';
import ensureMessageIsValid from '../../wallet/utils/ensureMessageIsValid';
import { MessageType } from '../models';
import { paramsToMessageParams } from '../utils/messageParamsParser';
import { PersonalSignHandler } from './signMessage';

jest.mock('../utils/messageParamsParser');
jest.mock('../../wallet/utils/ensureMessageIsValid');

describe('src/background/services/messages/handlers/signMessage.ts', () => {
  const displayDataMock = {
    data: {
      foo: 'bar',
    },
  };
  const activeNetworkMock = {
    chainId: 1,
  };

  let walletServiceMock;

  let networkServiceMock;

  const openApprovalWindowSpy = jest.spyOn(
    DAppRequestHandler.prototype,
    'openApprovalWindow'
  );

  beforeEach(() => {
    jest.resetAllMocks();

    walletServiceMock = {
      signMessage: jest.fn(),
      walletType: WalletType.MNEMONIC,
    } as any;

    networkServiceMock = {
      activeNetwork: activeNetworkMock,
    } as any;

    openApprovalWindowSpy.mockResolvedValue(undefined);
    (paramsToMessageParams as jest.Mock).mockReturnValue(displayDataMock);
  });

  it('handleUnauthenticated', async () => {
    const handler = new PersonalSignHandler(
      walletServiceMock,
      networkServiceMock
    );

    const request = {
      id: '123',
      method: DAppProviderRequest.ETH_SIGN,
      site: {
        tabId: 1,
      },
    } as any;

    const result = await handler.handleUnauthenticated(request);
    expect(result).toEqual({
      ...request,
      error: 'account not available',
    });
  });

  it('supports multiple signing methods', () => {
    const handler = new PersonalSignHandler(
      walletServiceMock,
      networkServiceMock
    );

    expect(handler.methods).toStrictEqual([
      DAppProviderRequest.ETH_SIGN,
      DAppProviderRequest.ETH_SIGN_TYPED_DATA,
      DAppProviderRequest.ETH_SIGN_TYPED_DATA_V1,
      DAppProviderRequest.ETH_SIGN_TYPED_DATA_V3,
      DAppProviderRequest.ETH_SIGN_TYPED_DATA_V4,
      DAppProviderRequest.PERSONAL_SIGN,
    ]);
  });

  describe('handleAuthenticated', () => {
    it('throws if walletType is undefined', async () => {
      walletServiceMock.walletType = undefined;
      const handler = new PersonalSignHandler(
        walletServiceMock,
        networkServiceMock
      );

      const request = {
        id: '123',
        method: DAppProviderRequest.ETH_SIGN,
        site: {
          tabId: 1,
        },
      } as any;

      await expect(handler.handleAuthenticated(request)).resolves.toStrictEqual(
        {
          ...request,
          error: 'wallet undefined',
        }
      );
    });

    it('throws if no active network found', async () => {
      networkServiceMock.activeNetwork = undefined;
      const handler = new PersonalSignHandler(
        walletServiceMock,
        networkServiceMock
      );

      const request = {
        id: '123',
        method: DAppProviderRequest.ETH_SIGN,
        site: {
          tabId: 1,
        },
      } as any;

      await expect(handler.handleAuthenticated(request)).resolves.toStrictEqual(
        {
          ...request,
          error: ethErrors.rpc.invalidRequest({
            message: 'no active network found',
          }),
        }
      );
    });

    it('throws if message is not valid', async () => {
      const errorMessage = 'some error';
      const handler = new PersonalSignHandler(
        walletServiceMock,
        networkServiceMock
      );

      const request = {
        id: '123',
        method: DAppProviderRequest.ETH_SIGN,
        site: {
          tabId: 1,
        },
      } as any;

      (ensureMessageIsValid as jest.Mock).mockImplementationOnce(() => {
        throw new Error(errorMessage);
      });

      await expect(handler.handleAuthenticated(request)).resolves.toStrictEqual(
        {
          ...request,
          error: ethErrors.rpc.invalidParams({
            message: errorMessage,
          }),
        }
      );
    });

    it('opens the approval window if message is valid', async () => {
      const handler = new PersonalSignHandler(
        walletServiceMock,
        networkServiceMock
      );

      const request = {
        id: '123',
        method: DAppProviderRequest.ETH_SIGN,
        site: {
          tabId: 1,
        },
      } as any;

      const result = await handler.handleAuthenticated(request);

      expect(ensureMessageIsValid).toHaveBeenCalledWith(
        request.method,
        displayDataMock.data,
        activeNetworkMock.chainId
      );
      expect(result).toStrictEqual({
        ...request,
        result: DEFERRED_RESPONSE,
      });

      expect(openApprovalWindowSpy).toHaveBeenCalledWith(
        {
          ...request,
          displayData: displayDataMock,
          tabId: request.site.tabId,
        },
        `sign?id=${request.id}`
      );
    });
  });

  describe('onActionApproved', () => {
    const onSuccessMock = jest.fn();
    const onErrorMock = jest.fn();

    it('calls onSucces if signing succeeds', async () => {
      const result = 'signed_message';
      const handler = new PersonalSignHandler(
        walletServiceMock,
        networkServiceMock
      );

      (walletServiceMock.signMessage as jest.Mock).mockResolvedValueOnce(
        result
      );

      await handler.onActionApproved(
        {
          method: MessageType.ETH_SIGN,
          displayData: {
            data: displayDataMock,
          },
        } as any,
        undefined,
        onSuccessMock,
        onErrorMock
      );

      expect(onSuccessMock).toHaveBeenCalledWith(result);
    });

    it('calls onError if signing fails', async () => {
      const error = new Error('signing error');
      const handler = new PersonalSignHandler(
        walletServiceMock,
        networkServiceMock
      );

      (walletServiceMock.signMessage as jest.Mock).mockRejectedValueOnce(error);

      await handler.onActionApproved(
        {
          method: MessageType.ETH_SIGN,
          displayData: displayDataMock,
        } as any,
        undefined,
        onSuccessMock,
        onErrorMock
      );

      expect(onErrorMock).toHaveBeenCalledWith(error);
    });
  });
});
