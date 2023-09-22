import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ETHER_ADDRESS, SwapSide } from 'paraswap';
import { PerformSwapHandler } from './performSwap';
import ERC20 from '@openzeppelin/contracts/build/contracts/ERC20.json';
import { ChainId } from '@avalabs/chains-sdk';
import BN from 'bn.js';
import { ethers } from 'ethers';

describe('background/services/swap/handlers/performSwap.ts', () => {
  let contractSpy: jest.SpyInstance<ethers.Contract>;

  const allowanceMock = jest.fn();
  const estimateGasMock = jest.fn();
  const populateTransactionMock = jest.fn();
  const providerMock = {
    send: jest.fn(),
    getTransactionCount: jest.fn(),
  };
  const activeNetworkMock = {
    isTestnet: false,
    networkToken: {
      symbol: 'test token',
    },
  };
  const activeAccountMock = {
    addressC: '0x0000',
  };
  const swapServiceMock = {
    getParaswapSpender: jest.fn(),
    buildTx: jest.fn(),
  };
  const networkServiceMock = {
    activeNetwork: { ...activeNetworkMock },
    getAvalancheProvider: jest.fn(),
    sendTransaction: jest.fn(),
  };
  const walletServiceMock = {
    sign: jest.fn(),
  };
  const networkFeeServiceMock = {
    getNetworkFee: jest.fn(),
  };
  const accountsServiceMock = {
    activeAccount: { ...activeAccountMock },
  };

  const performSwapHandler = new PerformSwapHandler(
    swapServiceMock as any,
    networkServiceMock as any,
    walletServiceMock as any,
    networkFeeServiceMock as any,
    accountsServiceMock as any
  );

  const tabId = 862;

  const getRequest = (
    excludedParam?: string,
    modifiedParams?: Record<string, any>
  ) => {
    const params = {
      srcToken: '0x0000',
      destToken: '0x0001',
      srcDecimals: 10,
      destDecimals: 10,
      srcAmount: '10000',
      priceRoute: {
        destAmount: '20000',
        side: SwapSide.SELL,
      },
      destAmount: '20000',
      gasLimit: 1000,
      gasPrice: 100n,
      slippage: 1,
    };

    const requestParams = { ...params, ...(modifiedParams ?? {}) };

    if (excludedParam) {
      requestParams[excludedParam] = undefined;
    }

    return {
      request: {
        id: '123',
        method: ExtensionRequest.SWAP_PERFORM,
        params: Object.values(requestParams),
        tabId,
      } as any,
      params: requestParams,
    };
  };

  beforeEach(() => {
    jest.resetAllMocks();
    contractSpy = jest.spyOn(ethers, 'Contract').mockReturnValue({
      allowance: allowanceMock,
      approve: {
        estimateGas: estimateGasMock,
        populateTransaction: populateTransactionMock,
      },
    } as any);
    networkServiceMock.activeNetwork = { ...activeNetworkMock };
    accountsServiceMock.activeAccount = { ...activeAccountMock };
    networkServiceMock.getAvalancheProvider.mockResolvedValue(providerMock);
  });

  describe('error handling', () => {
    it('returns error if source token is missing', async () => {
      const { request } = getRequest('srcToken');

      await expect(performSwapHandler.handle(request)).resolves.toStrictEqual({
        ...request,
        error: 'no source token on request',
      });
    });

    it('returns error if destination token is missing', async () => {
      const { request } = getRequest('destToken');

      await expect(performSwapHandler.handle(request)).resolves.toStrictEqual({
        ...request,
        error: 'no destination token on request',
      });
    });

    it('returns error if source amount is missing', async () => {
      const { request } = getRequest('srcAmount');

      await expect(performSwapHandler.handle(request)).resolves.toStrictEqual({
        ...request,
        error: 'no amount on request',
      });
    });

    it('returns error if source decimals are missing', async () => {
      const { request } = getRequest('srcDecimals');

      await expect(performSwapHandler.handle(request)).resolves.toStrictEqual({
        ...request,
        error: 'request requires the decimals for source token',
      });
    });

    it('returns error if destination decimals are missing', async () => {
      const { request } = getRequest('destDecimals');

      await expect(performSwapHandler.handle(request)).resolves.toStrictEqual({
        ...request,
        error: 'request requires the decimals for destination token',
      });
    });

    it('returns error if destination amount is missing', async () => {
      const { request } = getRequest('destAmount');

      await expect(performSwapHandler.handle(request)).resolves.toStrictEqual({
        ...request,
        error: 'request requires a destAmount expected for destination token',
      });
    });

    it('returns error if price route is missing', async () => {
      const { request } = getRequest('priceRoute');

      await expect(performSwapHandler.handle(request)).resolves.toStrictEqual({
        ...request,
        error: 'request requires the paraswap priceRoute',
      });
    });

    it('returns error if gas limit is missing', async () => {
      const { request } = getRequest('gasLimit');

      await expect(performSwapHandler.handle(request)).resolves.toStrictEqual({
        ...request,
        error: 'request requires gas limit from paraswap response',
      });
    });

    it('returns error if there is no active network', async () => {
      const { request } = getRequest();

      (networkServiceMock.activeNetwork as any) = undefined;

      await expect(performSwapHandler.handle(request)).resolves.toStrictEqual({
        ...request,
        error: 'Network Init Error: Wrong network',
      });
    });

    it('returns error if active network is a test one', async () => {
      const { request } = getRequest();

      networkServiceMock.activeNetwork.isTestnet = true;

      await expect(performSwapHandler.handle(request)).resolves.toStrictEqual({
        ...request,
        error: 'Network Init Error: Wrong network',
      });
    });

    it('returns error if active account address is missing', async () => {
      const { request } = getRequest();

      (accountsServiceMock.activeAccount.addressC as any) = undefined;

      await expect(performSwapHandler.handle(request)).resolves.toStrictEqual({
        ...request,
        error: 'Wallet Error: address not defined',
      });
    });

    it('returns error on allowance error during approval', async () => {
      const { request, params } = getRequest();

      allowanceMock.mockRejectedValueOnce('some error');

      await expect(performSwapHandler.handle(request)).resolves.toStrictEqual({
        ...request,
        error: 'Allowance Error: some error',
      });
      expect(contractSpy).toHaveBeenCalledWith(
        params.srcToken,
        ERC20.abi,
        providerMock
      );
    });

    it('returns error on sign error during approval', async () => {
      const { request, params } = getRequest();

      allowanceMock.mockResolvedValueOnce(BigInt(params.srcAmount) - 1n);
      estimateGasMock.mockResolvedValueOnce(undefined);
      populateTransactionMock.mockResolvedValueOnce({
        data: 'data',
      });
      providerMock.getTransactionCount.mockResolvedValueOnce(1);
      walletServiceMock.sign.mockRejectedValueOnce('some error');

      await expect(performSwapHandler.handle(request)).resolves.toStrictEqual({
        ...request,
        error: 'Approve Error: some error',
      });
    });

    it('returns error on send transaction error during approval', async () => {
      const { request, params } = getRequest();

      allowanceMock.mockResolvedValueOnce(BigInt(params.srcAmount) - 1n);
      estimateGasMock.mockResolvedValueOnce(undefined);
      populateTransactionMock.mockResolvedValueOnce({
        data: 'data',
      });
      providerMock.getTransactionCount.mockResolvedValueOnce(1);
      walletServiceMock.sign.mockResolvedValueOnce({
        signedTx: 'signedTransaction',
      });
      networkServiceMock.sendTransaction.mockRejectedValueOnce('some error');

      await expect(performSwapHandler.handle(request)).resolves.toStrictEqual({
        ...request,
        error: 'Approve Error: some error',
      });
    });

    it('returns error on transaction build error', async () => {
      const { request, params } = getRequest();

      allowanceMock.mockResolvedValueOnce(BigInt(params.srcAmount) - 1n);
      estimateGasMock.mockResolvedValueOnce(undefined);
      populateTransactionMock.mockResolvedValueOnce({
        data: 'data',
      });
      providerMock.getTransactionCount.mockResolvedValueOnce(1);
      walletServiceMock.sign.mockResolvedValueOnce({
        signedTx: 'signedTransaction',
      });
      networkServiceMock.sendTransaction.mockResolvedValueOnce('approveTxHash');
      swapServiceMock.buildTx.mockRejectedValueOnce('some error');

      await expect(performSwapHandler.handle(request)).resolves.toStrictEqual({
        ...request,
        error: 'Data Error: Error: some error',
      });
    });

    it('returns error on sign error after building the transaction', async () => {
      const { request, params } = getRequest();

      allowanceMock.mockResolvedValueOnce(BigInt(params.srcAmount) - 1n);
      estimateGasMock.mockResolvedValueOnce(undefined);
      populateTransactionMock.mockResolvedValueOnce({
        data: 'data',
      });
      providerMock.getTransactionCount.mockResolvedValueOnce(1);
      walletServiceMock.sign.mockResolvedValueOnce({
        signedTx: 'signedTransaction',
      });
      networkServiceMock.sendTransaction.mockResolvedValueOnce('approveTxHash');
      swapServiceMock.buildTx.mockResolvedValueOnce({
        gas: '1',
        to: 'toAddress',
        data: 'data',
      });
      walletServiceMock.sign.mockRejectedValueOnce('some error');

      await expect(performSwapHandler.handle(request)).resolves.toStrictEqual({
        ...request,
        error: 'Tx Error: some error',
      });
    });

    it('returns error on sendTransaction error', async () => {
      const { request, params } = getRequest();

      allowanceMock.mockResolvedValueOnce(BigInt(params.srcAmount) - 1n);
      estimateGasMock.mockResolvedValueOnce(undefined);
      populateTransactionMock.mockResolvedValueOnce({
        data: 'data',
      });
      providerMock.getTransactionCount.mockResolvedValueOnce(1);
      walletServiceMock.sign.mockResolvedValueOnce({
        signedTx: 'signedTransaction',
      });
      networkServiceMock.sendTransaction.mockResolvedValueOnce('approveTxHash');
      swapServiceMock.buildTx.mockResolvedValueOnce({
        gas: '1',
        to: 'toAddress',
        data: 'data',
      });
      walletServiceMock.sign.mockResolvedValueOnce({
        signedTx: 'signedTransaction',
      });
      networkServiceMock.sendTransaction.mockRejectedValueOnce('some error');

      await expect(performSwapHandler.handle(request)).resolves.toStrictEqual({
        ...request,
        error: 'Tx Error: some error',
      });
    });
  });

  describe('functionality', () => {
    const spenderAddress = 'spenderAddress';
    const transactionCount = 1;
    const networkFee = {
      displayDecimals: 10,
      low: { maxFee: 1n },
      medium: { maxFee: 5n },
      high: { maxFee: 10n },
      isFixedFee: false,
    };
    const signedTx = 'signedTx';
    const approveTxHash = 'approveTxHash';
    const swapTxHash = 'swapTxHash';

    beforeEach(() => {
      allowanceMock.mockResolvedValue(9999n);

      swapServiceMock.getParaswapSpender.mockResolvedValue(spenderAddress);
      providerMock.getTransactionCount.mockResolvedValue(transactionCount);
      networkFeeServiceMock.getNetworkFee.mockResolvedValue(networkFee);
      walletServiceMock.sign.mockResolvedValue({
        signedTx,
      });
      networkServiceMock.sendTransaction.mockResolvedValue(approveTxHash);
      swapServiceMock.buildTx.mockResolvedValue({
        gas: '1',
        to: 'toAddress',
        data: 'data',
      });
    });

    describe('with approval for non-native tokens on the network', () => {
      beforeEach(() => {
        estimateGasMock.mockResolvedValue(undefined);
        populateTransactionMock.mockResolvedValue({
          data: 'data',
        });
        networkServiceMock.sendTransaction
          .mockResolvedValueOnce(approveTxHash)
          .mockResolvedValueOnce(swapTxHash);
      });

      it('swaps when the route is SELL', async () => {
        const { request, params } = getRequest();

        await expect(performSwapHandler.handle(request)).resolves.toStrictEqual(
          {
            ...request,
            result: {
              approveTxHash,
              swapTxHash,
            },
          }
        );

        expect(contractSpy).toHaveBeenCalledWith(
          params.srcToken,
          ERC20.abi,
          providerMock
        );
        expect(allowanceMock).toHaveBeenCalledWith(
          activeAccountMock.addressC,
          spenderAddress
        );
        expect(estimateGasMock).toHaveBeenCalledWith(
          spenderAddress,
          params.srcAmount
        );
        expect(populateTransactionMock).toHaveBeenCalledWith(
          spenderAddress,
          params.srcAmount
        );
        expect(walletServiceMock.sign).toHaveBeenNthCalledWith(
          1,
          {
            nonce: 1,
            chainId: ChainId.AVALANCHE_MAINNET_ID,
            gasPrice: networkFee.low.maxFee,
            gasLimit: params.gasLimit,
            data: 'data',
            to: params.srcToken,
          },
          tabId
        );
        expect(networkServiceMock.sendTransaction).toHaveBeenNthCalledWith(1, {
          signedTx,
        });
        expect(swapServiceMock.buildTx).toHaveBeenCalledWith(
          ChainId.AVALANCHE_MAINNET_ID.toString(),
          params.srcToken,
          params.destToken,
          params.srcAmount,
          '19800',
          params.priceRoute,
          activeAccountMock.addressC,
          'Avalanche',
          undefined,
          undefined,
          undefined,
          undefined,
          params.srcDecimals,
          params.destDecimals,
          undefined,
          undefined
        );
        expect(walletServiceMock.sign).toHaveBeenNthCalledWith(
          2,
          {
            nonce: 2,
            chainId: ChainId.AVALANCHE_MAINNET_ID,
            gasPrice: params.gasPrice,
            gasLimit: 1,
            data: 'data',
            to: 'toAddress',
            value: undefined,
          },
          tabId
        );
        expect(networkServiceMock.sendTransaction).toHaveBeenNthCalledWith(2, {
          signedTx,
        });
      });

      it('swaps when the route is BUY', async () => {
        const { request, params } = getRequest(undefined, {
          priceRoute: { side: SwapSide.BUY, destAmount: '20000' },
        });

        await expect(performSwapHandler.handle(request)).resolves.toStrictEqual(
          {
            ...request,
            result: {
              approveTxHash,
              swapTxHash,
            },
          }
        );

        expect(contractSpy).toHaveBeenCalledWith(
          params.srcToken,
          ERC20.abi,
          providerMock
        );
        expect(allowanceMock).toHaveBeenCalledWith(
          activeAccountMock.addressC,
          spenderAddress
        );
        expect(estimateGasMock).toHaveBeenCalledWith(spenderAddress, '10100');
        expect(populateTransactionMock).toHaveBeenCalledWith(
          spenderAddress,
          '10100'
        );
        expect(walletServiceMock.sign).toHaveBeenNthCalledWith(
          1,
          {
            nonce: 1,
            chainId: ChainId.AVALANCHE_MAINNET_ID,
            gasPrice: networkFee.low.maxFee,
            gasLimit: params.gasLimit,
            data: 'data',
            to: params.srcToken,
          },
          tabId
        );
        expect(networkServiceMock.sendTransaction).toHaveBeenNthCalledWith(1, {
          signedTx,
        });
        expect(swapServiceMock.buildTx).toHaveBeenCalledWith(
          ChainId.AVALANCHE_MAINNET_ID.toString(),
          params.srcToken,
          params.destToken,
          '10100',
          params.priceRoute.destAmount,
          params.priceRoute,
          activeAccountMock.addressC,
          'Avalanche',
          undefined,
          undefined,
          undefined,
          undefined,
          params.srcDecimals,
          params.destDecimals,
          undefined,
          undefined
        );
        expect(walletServiceMock.sign).toHaveBeenNthCalledWith(
          2,
          {
            nonce: 2,
            chainId: ChainId.AVALANCHE_MAINNET_ID,
            gasPrice: params.gasPrice,
            gasLimit: 1,
            data: 'data',
            to: 'toAddress',
            value: undefined,
          },
          tabId
        );
        expect(networkServiceMock.sendTransaction).toHaveBeenNthCalledWith(2, {
          signedTx,
        });
      });
    });

    describe('without approval for native tokens on the network', () => {
      beforeEach(() => {
        networkServiceMock.activeNetwork = {
          isTestnet: false,
          networkToken: {
            symbol: '0x0000',
          },
        };
        estimateGasMock.mockResolvedValue(undefined);
        populateTransactionMock.mockResolvedValue({
          data: 'data',
        });
        networkServiceMock.sendTransaction.mockResolvedValue(swapTxHash);
      });

      it('swaps when the route is SELL', async () => {
        const { request, params } = getRequest();

        await expect(performSwapHandler.handle(request)).resolves.toStrictEqual(
          {
            ...request,
            result: {
              approveTxHash: undefined,
              swapTxHash,
            },
          }
        );

        expect(contractSpy).not.toHaveBeenCalled();
        expect(allowanceMock).not.toHaveBeenCalled();
        expect(estimateGasMock).not.toHaveBeenCalled();
        expect(populateTransactionMock).not.toHaveBeenCalled();
        expect(swapServiceMock.buildTx).toHaveBeenCalledWith(
          ChainId.AVALANCHE_MAINNET_ID.toString(),
          ETHER_ADDRESS,
          params.destToken,
          params.srcAmount,
          '19800',
          params.priceRoute,
          activeAccountMock.addressC,
          'Avalanche',
          undefined,
          undefined,
          undefined,
          undefined,
          18,
          params.destDecimals,
          undefined,
          undefined
        );
        expect(walletServiceMock.sign).toHaveBeenCalledWith(
          {
            nonce: 1,
            chainId: ChainId.AVALANCHE_MAINNET_ID,
            gasPrice: params.gasPrice,
            gasLimit: 1,
            data: 'data',
            to: 'toAddress',
            value: `0x${new BN(params.srcAmount).toString('hex')}`,
          },
          tabId
        );
        expect(networkServiceMock.sendTransaction).toHaveBeenCalledWith({
          signedTx,
        });
      });

      it('swaps when the route is BUY', async () => {
        const { request, params } = getRequest(undefined, {
          priceRoute: { side: SwapSide.BUY, destAmount: '20000' },
        });

        await expect(performSwapHandler.handle(request)).resolves.toStrictEqual(
          {
            ...request,
            result: {
              approveTxHash: undefined,
              swapTxHash,
            },
          }
        );

        expect(contractSpy).not.toHaveBeenCalled();
        expect(allowanceMock).not.toHaveBeenCalled();
        expect(estimateGasMock).not.toHaveBeenCalled();
        expect(populateTransactionMock).not.toHaveBeenCalled();
        expect(swapServiceMock.buildTx).toHaveBeenCalledWith(
          ChainId.AVALANCHE_MAINNET_ID.toString(),
          ETHER_ADDRESS,
          params.destToken,
          '10100',
          params.priceRoute.destAmount,
          params.priceRoute,
          activeAccountMock.addressC,
          'Avalanche',
          undefined,
          undefined,
          undefined,
          undefined,
          18,
          params.destDecimals,
          undefined,
          undefined
        );
        expect(walletServiceMock.sign).toHaveBeenCalledWith(
          {
            nonce: 1,
            chainId: ChainId.AVALANCHE_MAINNET_ID,
            gasPrice: params.gasPrice,
            gasLimit: 1,
            data: 'data',
            to: 'toAddress',
            value: `0x${new BN('10100').toString('hex')}`,
          },
          tabId
        );
        expect(networkServiceMock.sendTransaction).toHaveBeenCalledWith({
          signedTx,
        });
      });
    });

    describe('without approval for non-native tokens if allowance is enough', () => {
      beforeEach(() => {
        allowanceMock.mockResolvedValue(10001n);
        networkServiceMock.sendTransaction.mockResolvedValue(swapTxHash);
      });

      it('swaps when the route is SELL', async () => {
        const { request, params } = getRequest();

        await expect(performSwapHandler.handle(request)).resolves.toStrictEqual(
          {
            ...request,
            result: {
              approveTxHash: undefined,
              swapTxHash,
            },
          }
        );

        expect(contractSpy).toHaveBeenCalledWith(
          params.srcToken,
          ERC20.abi,
          providerMock
        );
        expect(allowanceMock).toHaveBeenCalledWith(
          activeAccountMock.addressC,
          spenderAddress
        );
        expect(estimateGasMock).not.toHaveBeenCalled();
        expect(populateTransactionMock).not.toHaveBeenCalled();
        expect(swapServiceMock.buildTx).toHaveBeenCalledWith(
          ChainId.AVALANCHE_MAINNET_ID.toString(),
          params.srcToken,
          params.destToken,
          params.srcAmount,
          '19800',
          params.priceRoute,
          activeAccountMock.addressC,
          'Avalanche',
          undefined,
          undefined,
          undefined,
          undefined,
          params.srcDecimals,
          params.destDecimals,
          undefined,
          undefined
        );
        expect(walletServiceMock.sign).toHaveBeenCalledWith(
          {
            nonce: 1,
            chainId: ChainId.AVALANCHE_MAINNET_ID,
            gasPrice: params.gasPrice,
            gasLimit: 1,
            data: 'data',
            to: 'toAddress',
          },
          tabId
        );
        expect(networkServiceMock.sendTransaction).toHaveBeenCalledWith({
          signedTx,
        });
      });
    });
  });
});
