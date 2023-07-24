import { DAppRequestHandler } from '@src/background/connections/dAppConnection/DAppRequestHandler';
import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { DEFERRED_RESPONSE } from '@src/background/connections/middlewares/models';
import { ethErrors } from 'eth-rpc-errors';
import { WalletType } from '../../wallet/models';
import { MessageParams, MessageType } from '../models';
import { paramsToMessageParams } from '../utils/messageParamsParser';
import { PersonalSignHandler } from './signMessage';
import { _TypedDataEncoder } from 'ethers/lib/utils';
import ensureMessageFormatIsValid from '../../wallet/utils/ensureMessageFormatIsValid';

jest.mock('../../wallet/utils/ensureMessageFormatIsValid');
jest.mock('../utils/messageParamsParser');
jest.mock('ethers/lib/utils');

describe('src/background/services/messages/handlers/signMessage.ts', () => {
  const displayDataMock: MessageParams = {
    data: {
      foo: 'bar',
    },
    from: '0x0000000',
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

    it('throws if message format is invalid', async () => {
      const errorMessage = 'invalid message format';
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
        params: ['0x00000', '0x48656c6c6f20506c617967726f756e6421'],
      } as any;

      jest.mocked(ensureMessageFormatIsValid).mockImplementationOnce(() => {
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
      expect(ensureMessageFormatIsValid).toHaveBeenCalledWith(
        DAppProviderRequest.ETH_SIGN,
        { foo: 'bar' },
        1
      );
    });

    it('does not do type checks for ETH_SIGN, ETH_SIGN_TYPED_DATA and ETH_SIGN_TYPED_DATA_V1', async () => {
      const errorMessage = 'some type error';
      const handler = new PersonalSignHandler(
        walletServiceMock,
        networkServiceMock
      );

      const methodsWithoutTypeCheck = [
        DAppProviderRequest.ETH_SIGN,
        DAppProviderRequest.ETH_SIGN_TYPED_DATA,
        DAppProviderRequest.ETH_SIGN_TYPED_DATA_V1,
      ];

      for (const method of methodsWithoutTypeCheck) {
        const request = {
          id: '123',
          method,
          site: {
            tabId: 1,
          },
        } as any;

        jest.mocked(_TypedDataEncoder.getPayload).mockImplementationOnce(() => {
          throw new Error(errorMessage);
        });

        await expect(
          handler.handleAuthenticated(request)
        ).resolves.toStrictEqual({
          ...request,
          result: DEFERRED_RESPONSE,
        });

        expect(openApprovalWindowSpy).toHaveBeenCalledWith(
          {
            ...request,
            displayData: {
              messageParams: displayDataMock,
              isMessageValid: true,
            },
            tabId: request.site.tabId,
          },
          `sign?id=${request.id}`
        );
      }
    });

    it('does type checks for ETH_SIGN_TYPED_DATA_V3 and ETH_SIGN_TYPED_DATA_V4', async () => {
      const errorMessage = 'some type error';
      const handler = new PersonalSignHandler(
        walletServiceMock,
        networkServiceMock
      );

      const messageParamsMock: MessageParams = {
        data: {
          types: {
            EIP712Domain: [],
            Mail: [{ name: 'name', type: 'string' }],
          },
          message: { name: 'asdasd' },
          domain: {
            name: 'test site',
            chainId: 1,
          },
        },
        from: '0x00000',
      };

      jest.mocked(paramsToMessageParams).mockReturnValue(messageParamsMock);

      const methodsWithTypeCheck = [
        DAppProviderRequest.ETH_SIGN_TYPED_DATA_V3,
        DAppProviderRequest.ETH_SIGN_TYPED_DATA_V4,
      ];

      for (const method of methodsWithTypeCheck) {
        const request = {
          id: '123',
          method,
          site: {
            tabId: 1,
          },
        } as any;

        jest.mocked(_TypedDataEncoder.getPayload).mockImplementationOnce(() => {
          throw new Error(errorMessage);
        });

        await expect(
          handler.handleAuthenticated(request)
        ).resolves.toStrictEqual({
          ...request,
          result: DEFERRED_RESPONSE,
        });

        expect(_TypedDataEncoder.getPayload).toHaveBeenCalledWith(
          {
            name: 'test site',
            chainId: 1,
          },
          { Mail: [{ name: 'name', type: 'string' }] },
          { name: 'asdasd' }
        );

        expect(openApprovalWindowSpy).toHaveBeenCalledWith(
          {
            ...request,
            displayData: {
              messageParams: messageParamsMock,
              isMessageValid: false,
              validationError: 'Error: some type error',
            },
            tabId: request.site.tabId,
          },
          `sign?id=${request.id}`
        );
      }
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

      expect(ensureMessageFormatIsValid).toHaveBeenCalledWith(
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
          displayData: {
            messageParams: displayDataMock,
            isMessageValid: true,
          },
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
            messageParams: displayDataMock,
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
          displayData: {
            messageParams: displayDataMock,
          },
        } as any,
        undefined,
        onSuccessMock,
        onErrorMock
      );

      expect(onErrorMock).toHaveBeenCalledWith(error);
    });
  });
});
