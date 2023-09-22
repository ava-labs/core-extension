import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { DAppRequestHandler } from '@src/background/connections/dAppConnection/DAppRequestHandler';
import { ethErrors } from 'eth-rpc-errors';
import { BitcoinSendTransactionHandler } from '@src/background/services/wallet/handlers/bitcoin_sendTransaction';
import { isBtcAddressInNetwork } from '@src/utils/isBtcAddressInNetwork';
import { DEFERRED_RESPONSE } from '@src/background/connections/middlewares/models';
import { Action } from '@src/background/services/actions/models';
import { AccountType } from '../../accounts/models';
jest.mock('@src/utils/isBtcAddressInNetwork');

describe('src/background/services/wallet/handlers/bitcoin_sendTransaction.ts', () => {
  const request = {
    id: '123',
    method: DAppProviderRequest.BITCOIN_SEND_TRANSACTION,
    params: ['address', '1', 10],
    site: {
      tabId: 1,
    },
  };
  const frontendTabId = 987;

  const openApprovalWindowSpy = jest.spyOn(
    DAppRequestHandler.prototype,
    'openApprovalWindow'
  );

  const isMainnet = jest.fn();
  const signMock = jest.fn();
  const sendTransactionMock = jest.fn();
  const updateBalancesForNetworksMock = jest.fn();

  const validateStateAndCalculateFeesMock = jest.fn();
  const getTransactionRequestMock = jest.fn();
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
  const balancesServiceBTCMock = {};
  const balanceAggregatorServiceMock = {
    balances: {
      ChainId: {
        btc1: {
          BTC: {},
        },
      },
    },
    updateBalancesForNetworks: updateBalancesForNetworksMock,
  };

  const sendServiceBtcMock = {
    validateStateAndCalculateFees: validateStateAndCalculateFeesMock,
    getTransactionRequest: getTransactionRequestMock,
  };

  beforeEach(() => {
    jest.resetAllMocks();
    isMainnet.mockReturnValue(true);
    openApprovalWindowSpy.mockResolvedValue(undefined);
    (accountsServiceMock as any).activeAccount = activeAccountMock;
  });

  describe('handleUnauthenticated', () => {
    it('returns error for unauthorized requests', async () => {
      const handler = new BitcoinSendTransactionHandler(
        {} as any,
        {} as any,
        {} as any,
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
    const handler = new BitcoinSendTransactionHandler(
      {} as any,
      networkServiceMock as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any
    );

    it('returns error if the active account is imported via WalletConnect', async () => {
      jest.mocked(isBtcAddressInNetwork).mockReturnValueOnce(true);
      const sendHandler = new BitcoinSendTransactionHandler(
        walletServiceMock as any,
        networkServiceMock as any,
        balancesServiceBTCMock as any,
        {
          activeAccount: {
            addressC: 'abcd1234',
            addressBTC: 'bc1234',
            type: AccountType.WALLET_CONNECT,
          },
        } as any,
        sendServiceBtcMock as any,
        balanceAggregatorServiceMock as any
      );

      const result = await sendHandler.handleAuthenticated(request);

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
        balancesServiceBTCMock as any,
        {
          activeAccount: {
            addressC: 'abcd1234',
          },
        } as any,
        sendServiceBtcMock as any,
        balanceAggregatorServiceMock as any
      );

      const result = await sendHandler.handleAuthenticated(request);

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
      const result = await handler.handleAuthenticated(req);

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
        params: ['btc', undefined, 1],
      };
      const result = await handler.handleAuthenticated(req);

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
      const result = await handler.handleAuthenticated(req);

      expect(result).toEqual({
        ...req,
        error: ethErrors.rpc.invalidParams({
          message: 'Missing fee rate',
        }),
      });
    });

    it('returns error if address is invalid', async () => {
      (isBtcAddressInNetwork as jest.Mock).mockReturnValueOnce(false);
      const result = await handler.handleAuthenticated(request);
      expect(result).toEqual({
        ...request,
        error: ethErrors.rpc.invalidParams({
          message: 'Not a valid address.',
        }),
      });
    });

    it('returns error if there is no active account', async () => {
      (isBtcAddressInNetwork as jest.Mock).mockReturnValueOnce(true);
      const result = await handler.handleAuthenticated(request);
      expect(result).toEqual({
        ...request,
        error: ethErrors.rpc.invalidRequest({
          message: 'No active account found',
        }),
      });
    });

    it('returns error if cant verify form state', async () => {
      const sendHandler = new BitcoinSendTransactionHandler(
        walletServiceMock as any,
        networkServiceMock as any,
        balancesServiceBTCMock as any,
        accountsServiceMock as any,
        sendServiceBtcMock as any,
        balanceAggregatorServiceMock as any
      );

      (isBtcAddressInNetwork as jest.Mock).mockReturnValueOnce(true);
      validateStateAndCalculateFeesMock.mockReturnValueOnce({
        error: {
          error: 'Form error',
          message: 'Form error',
        },
      });

      const result = await sendHandler.handleAuthenticated(request);
      expect(result).toEqual({
        ...request,
        error: ethErrors.rpc.invalidRequest({
          message: 'Form error',
        }),
      });
    });

    it('returns error if cant send', async () => {
      const sendHandler = new BitcoinSendTransactionHandler(
        walletServiceMock as any,
        networkServiceMock as any,
        balancesServiceBTCMock as any,
        accountsServiceMock as any,
        sendServiceBtcMock as any,
        balanceAggregatorServiceMock as any
      );

      (isBtcAddressInNetwork as jest.Mock).mockReturnValueOnce(true);
      validateStateAndCalculateFeesMock.mockReturnValueOnce({
        error: undefined,
      });

      const result = await sendHandler.handleAuthenticated(request);
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
        balancesServiceBTCMock as any,
        accountsServiceMock as any,
        sendServiceBtcMock as any,
        balanceAggregatorServiceMock as any
      );

      (isBtcAddressInNetwork as jest.Mock).mockReturnValueOnce(true);
      validateStateAndCalculateFeesMock.mockReturnValueOnce({
        canSubmit: true,
        amount: '1',
        address: 'btc1',
      });

      const result = await sendHandler.handleAuthenticated(request);

      expect(openApprovalWindowSpy).toHaveBeenCalledWith(
        {
          ...request,
          tabId: request.site.tabId,
          displayData: {
            sendState: {
              canSubmit: true,
              amount: '1',
              address: 'btc1',
            },
          },
        },
        'approve/bitcoinSignTx'
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
        sendState: {
          canSubmit: true,
          amount: '1',
          address: 'btc1',
        },
      },
    } as unknown as Action;

    it('returns error when signing fails', async () => {
      const handler = new BitcoinSendTransactionHandler(
        walletServiceMock as any,
        networkServiceMock as any,
        balancesServiceBTCMock as any,
        accountsServiceMock as any,
        sendServiceBtcMock as any,
        balanceAggregatorServiceMock as any
      );

      getTransactionRequestMock.mockReturnValueOnce({});
      getBitcoinNetworkMock.mockResolvedValue({});

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
        balancesServiceBTCMock as any,
        accountsServiceMock as any,
        sendServiceBtcMock as any,
        balanceAggregatorServiceMock as any
      );

      getTransactionRequestMock.mockReturnValueOnce({});
      getBitcoinNetworkMock.mockResolvedValue({ chainId: 3 });

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

      expect(signMock).toHaveBeenCalledWith({}, frontendTabId, { chainId: 3 });
      expect(onSuccessMock).toHaveBeenCalledWith('resultHash');
    });
  });
});
