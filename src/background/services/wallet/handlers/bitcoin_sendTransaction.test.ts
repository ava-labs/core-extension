import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { ethErrors } from 'eth-rpc-errors';
import { BitcoinSendTransactionHandler } from '@src/background/services/wallet/handlers/bitcoin_sendTransaction';
import { isBtcAddressInNetwork } from '@src/utils/isBtcAddressInNetwork';
import { DEFERRED_RESPONSE } from '@src/background/connections/middlewares/models';
import { Action } from '@src/background/services/actions/models';
import { AccountType } from '../../accounts/models';
import { ChainId, NetworkVMType } from '@avalabs/core-chains-sdk';
import { createTransferTx } from '@avalabs/core-wallets-sdk';

import { openApprovalWindow } from '@src/background/runtime/openApprovalWindow';
import { buildRpcCall } from '@src/tests/test-utils';
import { getProviderForNetwork } from '@src/utils/network/getProviderForNetwork';

jest.mock('@avalabs/core-wallets-sdk');
jest.mock('@src/utils/isBtcAddressInNetwork');
jest.mock('@src/background/runtime/openApprovalWindow');
jest.mock('@src/utils/network/getProviderForNetwork');

describe('src/background/services/wallet/handlers/bitcoin_sendTransaction.ts', () => {
  const request = {
    id: '123',
    method: DAppProviderRequest.BITCOIN_SEND_TRANSACTION,
    params: ['address', '1', 10],
    site: {
      tabId: 1,
    } as any,
  };
  const frontendTabId = 987;

  const isMainnet = jest.fn();
  const signMock = jest.fn();
  const sendTransactionMock = jest.fn();
  const getBalancesForNetworksMock = jest.fn();
  const captureEventMock = jest.fn();

  const getBitcoinNetworkMock = jest.fn();
  const activeAccountMock = {
    addressBTC: 'btc1',
  };

  const walletServiceMock = {
    sign: signMock,
  };

  const networkServiceMock = {
    isMainnet: isMainnet,
    getBitcoinNetwork: getBitcoinNetworkMock,
    sendTransaction: sendTransactionMock,
  };
  const accountsServiceMock = {};
  const balanceAggregatorServiceMock = {
    getBalancesForNetworks: getBalancesForNetworksMock,
  };
  const analyticsServiceMock = {
    captureEvent: captureEventMock,
  };

  beforeEach(() => {
    jest.resetAllMocks();
    isMainnet.mockReturnValue(true);
    jest.mocked(isBtcAddressInNetwork).mockReturnValue(true);
    getBitcoinNetworkMock.mockResolvedValue({
      vmName: NetworkVMType.BITCOIN,
    });
    jest.mocked(getProviderForNetwork).mockReturnValue({
      getScriptsForUtxos: jest.fn().mockResolvedValue([]),
      getNetwork: jest.fn(),
    } as any);
    jest
      .mocked(createTransferTx)
      .mockReturnValue({ fee: 5, inputs: [], outputs: [] });
    jest.mocked(openApprovalWindow).mockResolvedValue(undefined);
    getBitcoinNetworkMock.mockResolvedValue({
      vmName: NetworkVMType.BITCOIN,
    });
    getBalancesForNetworksMock.mockResolvedValue({
      [ChainId.BITCOIN_TESTNET]: {
        btc1: {
          BTC: {},
        },
      },
      [ChainId.BITCOIN]: {
        btc1: {
          BTC: {},
        },
      },
    });
    (accountsServiceMock as any).activeAccount = activeAccountMock;
  });

  describe('handleUnauthenticated', () => {
    it('returns error for unauthorized requests', async () => {
      const handler = new BitcoinSendTransactionHandler(
        {} as any,
        {} as any,
        {} as any,
        {} as any,
        {} as any
      );
      const result = await handler.handleUnauthenticated(buildRpcCall(request));

      expect(result).toEqual({
        ...request,
        error: ethErrors.provider.unauthorized(),
      });
    });
  });

  describe('handleAuthenticated', () => {
    const handler = new BitcoinSendTransactionHandler(
      {} as any,
      networkServiceMock as any,
      {
        activeAccount: {
          addressC: 'abcd1234',
          addressBTC: activeAccountMock.addressBTC,
          type: AccountType.PRIMARY,
        },
      } as any,
      balanceAggregatorServiceMock as any,
      analyticsServiceMock as any
    );

    it('returns error if the active account is imported via WalletConnect', async () => {
      jest.mocked(isBtcAddressInNetwork).mockReturnValueOnce(true);
      const sendHandler = new BitcoinSendTransactionHandler(
        walletServiceMock as any,
        networkServiceMock as any,
        {
          activeAccount: {
            addressC: 'abcd1234',
            addressBTC: activeAccountMock.addressBTC,
            type: AccountType.WALLET_CONNECT,
          },
        } as any,
        balanceAggregatorServiceMock as any,
        analyticsServiceMock as any
      );

      const result = await sendHandler.handleAuthenticated(
        buildRpcCall(request)
      );

      expect(result).toEqual({
        ...request,
        error: ethErrors.rpc.invalidRequest({
          message: 'The active account does not support BTC transactions',
        }),
      });
    });

    it('returns error if the active account has no BTC address', async () => {
      jest.mocked(isBtcAddressInNetwork).mockReturnValueOnce(true);
      const sendHandler = new BitcoinSendTransactionHandler(
        walletServiceMock as any,
        networkServiceMock as any,
        {
          activeAccount: {
            addressC: 'abcd1234',
          },
        } as any,
        balanceAggregatorServiceMock as any,
        analyticsServiceMock as any
      );

      const result = await sendHandler.handleAuthenticated(
        buildRpcCall(request)
      );

      expect(result).toEqual({
        ...request,
        error: ethErrors.rpc.invalidRequest({
          message: 'The active account does not support BTC transactions',
        }),
      });
    });

    it('returns error if address is not provided', async () => {
      const req = {
        ...request,
        params: [undefined, '1', 1],
      };
      const result = await handler.handleAuthenticated(buildRpcCall(req));

      expect(result).toEqual({
        ...req,
        error: ethErrors.rpc.invalidParams({
          message: 'Missing address',
        }),
      });
    });

    it('returns error if amount is not provided', async () => {
      const req = {
        ...request,
        params: ['tb1qdx76h4su9wavjjpzxqd4ar5ydcy2e05tvp7d6j', undefined, 1],
      };
      const result = await handler.handleAuthenticated(buildRpcCall(req));

      expect(result).toEqual({
        ...req,
        error: ethErrors.rpc.invalidParams({
          message: 'Missing amount',
        }),
      });
    });

    it('returns error if fee rate is not provided', async () => {
      const req = {
        ...request,
        params: ['btc', '1', undefined],
      };
      const result = await handler.handleAuthenticated(buildRpcCall(req));

      expect(result).toEqual({
        ...req,
        error: ethErrors.rpc.invalidParams({
          message: 'Missing fee rate',
        }),
      });
    });

    it('returns error if address is invalid', async () => {
      (isBtcAddressInNetwork as jest.Mock).mockReturnValueOnce(false);
      const result = await handler.handleAuthenticated(buildRpcCall(request));
      expect(result).toEqual({
        ...request,
        error: ethErrors.rpc.invalidParams({
          message: 'Not a valid address.',
        }),
      });
    });

    it('returns error if there is no active account', async () => {
      (isBtcAddressInNetwork as jest.Mock).mockReturnValueOnce(true);
      const sendHandler = new BitcoinSendTransactionHandler(
        walletServiceMock as any,
        networkServiceMock as any,
        {} as any,
        balanceAggregatorServiceMock as any,
        analyticsServiceMock as any
      );
      const result = await sendHandler.handleAuthenticated({ request } as any);
      expect(result).toEqual({
        ...request,
        error: ethErrors.rpc.invalidRequest({
          message: 'No active account found',
        }),
      });
    });

    it('returns error if unable to construct a transaction', async () => {
      jest.mocked(createTransferTx).mockImplementationOnce(() => {
        throw new Error('hmm');
      });

      const result = await handler.handleAuthenticated(buildRpcCall(request));
      expect(result).toEqual({
        ...request,
        error: ethErrors.rpc.invalidRequest({
          message: 'Unable to construct the transaction.',
        }),
      });
    });

    it('opens the approval window and returns deferred response', async () => {
      const sendHandler = new BitcoinSendTransactionHandler(
        walletServiceMock as any,
        networkServiceMock as any,
        accountsServiceMock as any,
        balanceAggregatorServiceMock as any,
        analyticsServiceMock as any
      );

      const result = await sendHandler.handleAuthenticated(
        buildRpcCall(request)
      );

      expect(openApprovalWindow).toHaveBeenCalledWith(
        expect.objectContaining({
          ...request,
          displayData: {
            address: 'address',
            amount: 1,
            balance: {},
            feeRate: 10,
            from: 'btc1',
            sendFee: 5,
          },
        }),
        'approve/bitcoinSignTx'
      );

      expect(result).toEqual({
        ...request,
        result: DEFERRED_RESPONSE,
      });
    });

    it('works even if active network is not bitcoin', async () => {
      const sendHandler = new BitcoinSendTransactionHandler(
        walletServiceMock as any,
        {
          ...networkServiceMock,
          activeNetwork: {
            vmName: NetworkVMType.EVM,
          },
        } as any,
        accountsServiceMock as any,
        balanceAggregatorServiceMock as any,
        analyticsServiceMock as any
      );

      const result = await sendHandler.handleAuthenticated(
        buildRpcCall(request)
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
        address: 'address',
        amount: 1,
        balance: {},
        feeRate: 10,
        from: 'btc1',
        sendFee: 5,
      },
    } as unknown as Action;

    it('returns error when signing fails', async () => {
      const handler = new BitcoinSendTransactionHandler(
        walletServiceMock as any,
        networkServiceMock as any,
        accountsServiceMock as any,
        balanceAggregatorServiceMock as any,
        analyticsServiceMock as any
      );

      getBitcoinNetworkMock.mockResolvedValue({
        chainId: ChainId.BITCOIN_TESTNET,
        vmName: NetworkVMType.BITCOIN,
      });

      const onSuccessMock = jest.fn();
      const onErrorMock = jest.fn();
      signMock.mockRejectedValueOnce(new Error('sign failed'));

      await handler.onActionApproved(
        pendingActionMock,
        {},
        onSuccessMock,
        onErrorMock,
        frontendTabId
      );

      expect(onErrorMock).toHaveBeenCalledWith(expect.any(Error));
      expect(onErrorMock).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'sign failed',
        })
      );
    });

    it('returns success when successfull', async () => {
      const handler = new BitcoinSendTransactionHandler(
        walletServiceMock as any,
        networkServiceMock as any,
        accountsServiceMock as any,
        balanceAggregatorServiceMock as any,
        analyticsServiceMock as any
      );

      getBitcoinNetworkMock.mockResolvedValue({
        chainId: ChainId.BITCOIN_TESTNET,
        vmName: NetworkVMType.BITCOIN,
      });

      const onSuccessMock = jest.fn();
      const onErrorMock = jest.fn();

      signMock.mockResolvedValue({ signedTx: 'resultHash' });
      sendTransactionMock.mockReturnValueOnce('resultHash');
      await handler.onActionApproved(
        pendingActionMock,
        {},
        onSuccessMock,
        onErrorMock,
        frontendTabId
      );
      expect(signMock).toHaveBeenCalledWith(
        {
          inputs: [],
          outputs: [],
        },
        {
          chainId: ChainId.BITCOIN_TESTNET,
          vmName: NetworkVMType.BITCOIN,
        },
        frontendTabId
      );
      expect(onSuccessMock).toHaveBeenCalledWith('resultHash');
    });
  });
});
