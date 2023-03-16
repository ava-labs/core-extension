import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { ethErrors } from 'eth-rpc-errors';
import { AvalancheSendTransactionHandler } from './avalanche_sendTransaction';
import { UnsignedTx, EVMUnsignedTx } from '@avalabs/avalanchejs-v2';
import { parseAvalancheTx } from '../utils/parseAvalancheTx';
import { DEFERRED_RESPONSE } from '@src/background/connections/middlewares/models';
import { DAppRequestHandler } from '@src/background/connections/dAppConnection/DAppRequestHandler';
import { Action } from '../../actions/models';

jest.mock('@avalabs/avalanchejs-v2');
jest.mock('@src/background/services/wallet/utils/parseAvalancheTx');

describe('src/background/services/wallet/handlers/avalanche_sendTransaction.ts', () => {
  const request = {
    id: '123',
    method: DAppProviderRequest.AVALANCHE_SEND_TRANSACTION,
    params: ['unsignedTx'],
    site: {
      tabId: 1,
    },
  };

  const openApprovalWindowSpy = jest.spyOn(
    DAppRequestHandler.prototype,
    'openApprovalWindow'
  );
  const getAvalanceProviderXPMock = jest.fn();
  const getAvalancheNetworkXPMock = jest.fn();
  const signMock = jest.fn();
  const getVMMock = jest.fn();
  const toBytesMock = jest.fn();
  const getContextMock = jest.fn();
  const issueTxHexMock = jest.fn();
  const getAddressesMock = jest.fn();
  const onSuccessMock = jest.fn();
  const onErrorMock = jest.fn();

  const activeAccountMock = {
    addressAVM: 'X-fuji1',
    addressCoreEth: 'C-fuji1',
    addressPVM: 'C-fuji1',
  };
  const walletServiceMock = {
    sign: signMock,
  };
  const networkServiceMock = {
    getAvalanceProviderXP: getAvalanceProviderXPMock,
    getAvalancheNetworkXP: getAvalancheNetworkXPMock,
  };
  const accountsServiceMock = {};
  const unsignedTxMock = {
    getVM: getVMMock,
    toBytes: toBytesMock,
    addressMaps: {
      getAddresses: getAddressesMock,
    },
  };
  const providerMock = {
    getContext: getContextMock,
    issueTxHex: issueTxHexMock,
  };

  beforeEach(() => {
    jest.resetAllMocks();
    (UnsignedTx.fromJSON as jest.Mock).mockReturnValue(unsignedTxMock);
    (EVMUnsignedTx.fromJSON as jest.Mock).mockReturnValue(unsignedTxMock);
    getVMMock.mockReturnValue('EVM');
    toBytesMock.mockReturnValue('some bytes');
    signMock.mockReturnValue('signed tx hex');
    getAvalancheNetworkXPMock.mockReturnValue('network');
    issueTxHexMock.mockResolvedValue({ txID: 1 });
    getAvalanceProviderXPMock.mockResolvedValue(providerMock);
    getAddressesMock.mockReturnValue([]);
    openApprovalWindowSpy.mockResolvedValue(undefined);
    (accountsServiceMock as any).activeAccount = activeAccountMock;
  });

  describe('handleUnauthenticated', () => {
    it('returns error for unauthorized requests', async () => {
      const handler = new AvalancheSendTransactionHandler(
        {} as any,
        {} as any,
        {} as any
      );
      const result = await handler.handleUnauthenticated(request);

      expect(result).toEqual({
        ...request,
        error: ethErrors.provider.unauthorized(),
      });
    });
  });

  describe('handleAuthenticated', () => {
    it('returns error if unsigned transaction is not provided', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { params, ...requestWithoutParam } = request;
      const handler = new AvalancheSendTransactionHandler(
        {} as any,
        {} as any,
        {} as any
      );
      const result = await handler.handleAuthenticated(requestWithoutParam);

      expect(result).toEqual({
        ...requestWithoutParam,
        error: ethErrors.rpc.invalidParams({
          message: 'Missing unsigned transaction JSON object',
        }),
      });
    });

    it('returns error if there is no active account', async () => {
      unsignedTxMock.getVM.mockReturnValueOnce('AVM');
      const handler = new AvalancheSendTransactionHandler(
        {} as any,
        {} as any,
        {} as any
      );
      const result = await handler.handleAuthenticated(request);

      expect(result).toEqual({
        ...request,
        error: ethErrors.rpc.invalidRequest({
          message: 'No active account found',
        }),
      });
    });

    it('returns error if fails to parse transaction', async () => {
      (parseAvalancheTx as jest.Mock).mockReturnValueOnce({
        type: 'unknown',
      });

      const handler = new AvalancheSendTransactionHandler(
        walletServiceMock as any,
        networkServiceMock as any,
        accountsServiceMock as any
      );
      const result = await handler.handleAuthenticated(request);

      expect(result).toEqual({
        ...request,
        error: ethErrors.rpc.invalidParams({
          message: 'Unable to parse transaction data. Unsupported tx type?',
        }),
      });
    });

    it('opens the approval window and returns deferred response', async () => {
      (parseAvalancheTx as jest.Mock).mockReturnValueOnce({
        type: 'import',
      });

      const handler = new AvalancheSendTransactionHandler(
        walletServiceMock as any,
        networkServiceMock as any,
        accountsServiceMock as any
      );
      const result = await handler.handleAuthenticated(request);

      expect(openApprovalWindowSpy).toHaveBeenCalledWith(
        {
          ...request,
          tabId: request.site.tabId,
          displayData: {
            unsignedTxJson: 'unsignedTx',
            txBuffer: Buffer.from('some bytes'),
            txData: {
              type: 'import',
            },
            vm: 'EVM',
          },
        },
        'approve/avalancheSignTx?id=123'
      );

      expect(result).toEqual({
        ...request,
        result: DEFERRED_RESPONSE,
      });
    });
  });

  describe('onActionApproved', () => {
    const pendingActionMock = {
      displayData: {
        vm: 'EVM',
        unsignedTxJson: 'unsignedTxJson',
      },
    } as unknown as Action;

    it('returns error when there are multiple addresses without indices', async () => {
      const handler = new AvalancheSendTransactionHandler(
        walletServiceMock as any,
        networkServiceMock as any,
        accountsServiceMock as any
      );

      getAddressesMock.mockReturnValueOnce(['addr1', 'addr2']);

      await handler.onActionApproved(
        pendingActionMock,
        {},
        onSuccessMock,
        onErrorMock
      );

      expect(onErrorMock).toHaveBeenCalledWith(expect.any(Error));
      expect(onErrorMock).toHaveBeenCalledWith(
        expect.objectContaining({
          message:
            'Transaction contains multiple addresses, but indices were not provided',
        })
      );
    });

    it('returns error when signing fails', async () => {
      const error = new Error('some error');
      const handler = new AvalancheSendTransactionHandler(
        walletServiceMock as any,
        networkServiceMock as any,
        accountsServiceMock as any
      );

      signMock.mockRejectedValueOnce(error);

      await handler.onActionApproved(
        pendingActionMock,
        {},
        onSuccessMock,
        onErrorMock
      );

      expect(onErrorMock).toHaveBeenCalledWith(error);
    });

    it('sings transactions correctly on C', async () => {
      const handler = new AvalancheSendTransactionHandler(
        walletServiceMock as any,
        networkServiceMock as any,
        accountsServiceMock as any
      );

      await handler.onActionApproved(
        pendingActionMock,
        {},
        onSuccessMock,
        onErrorMock
      );

      expect(signMock).toHaveBeenCalledWith(
        {
          tx: unsignedTxMock,
          externalIndices: undefined,
          internalIndices: undefined,
        },
        'network'
      );
      expect(EVMUnsignedTx.fromJSON).toBeCalledWith(
        pendingActionMock.displayData.unsignedTxJson
      );
      expect(issueTxHexMock).toHaveBeenCalledWith('signed tx hex', 'EVM');
      expect(onSuccessMock).toHaveBeenCalledWith(1);
    });

    it('sings transactions correctly on X/P', async () => {
      const handler = new AvalancheSendTransactionHandler(
        walletServiceMock as any,
        networkServiceMock as any,
        accountsServiceMock as any
      );

      await handler.onActionApproved(
        {
          displayData: { ...pendingActionMock.displayData, vm: 'AVM' },
        } as unknown as Action,
        {},
        onSuccessMock,
        onErrorMock
      );

      expect(signMock).toHaveBeenCalledWith(
        {
          tx: unsignedTxMock,
          externalIndices: undefined,
          internalIndices: undefined,
        },
        'network'
      );
      expect(UnsignedTx.fromJSON).toBeCalledWith(
        pendingActionMock.displayData.unsignedTxJson
      );
      expect(issueTxHexMock).toHaveBeenCalledWith('signed tx hex', 'AVM');
      expect(onSuccessMock).toHaveBeenCalledWith(1);
    });

    it('sings transactions correctly on X/P with multiple addresses', async () => {
      const handler = new AvalancheSendTransactionHandler(
        walletServiceMock as any,
        networkServiceMock as any,
        accountsServiceMock as any
      );

      getAddressesMock.mockReturnValueOnce(['addr1', 'addr2']);

      await handler.onActionApproved(
        {
          params: [undefined, [0, 1], [2, 3]],
          displayData: { ...pendingActionMock.displayData, vm: 'AVM' },
        } as unknown as Action,
        {},
        onSuccessMock,
        onErrorMock
      );

      expect(signMock).toHaveBeenCalledWith(
        {
          tx: unsignedTxMock,
          externalIndices: [0, 1],
          internalIndices: [2, 3],
        },
        'network'
      );
      expect(UnsignedTx.fromJSON).toBeCalledWith(
        pendingActionMock.displayData.unsignedTxJson
      );
      expect(issueTxHexMock).toHaveBeenCalledWith('signed tx hex', 'AVM');
      expect(onSuccessMock).toHaveBeenCalledWith(1);
    });
  });
});
