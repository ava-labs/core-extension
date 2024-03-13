import { Blockchain, BridgeConfig, getAssets } from '@avalabs/bridge-sdk';
import { ChainId } from '@avalabs/chains-sdk';
import { bnToBig, stringToBN } from '@avalabs/utils-sdk';
import { DAppRequestHandler } from '@src/background/connections/dAppConnection/DAppRequestHandler';
import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { DEFERRED_RESPONSE } from '@src/background/connections/middlewares/models';
import { AccountType, PrimaryAccount } from '../../accounts/models';
import { BtcTransactionResponse } from '../models';
import { Action, ActionStatus } from './../../actions/models';
import { AvalancheBridgeAsset } from './avalanche_bridgeAsset';
import { TransactionResponse } from 'ethers';
import { TokenType } from '../../balances/models';
import { BN } from 'bn.js';
import {
  btcAsset,
  evmAsset,
  mockConfig,
  nativeAsset,
} from '../fixtures/mockBridgeConfig';
import { encryptAnalyticsData } from '../../analytics/utils/encryptAnalyticsData';

jest.mock('@avalabs/bridge-sdk', () => {
  const originalModule = jest.requireActual('@avalabs/bridge-sdk');
  return {
    ...originalModule,
    getAssets: jest.fn(),
  };
});

jest.mock('../../analytics/utils/encryptAnalyticsData');

const frontendTabId = 654;

const mockBridgeConfig: BridgeConfig = { config: mockConfig };

describe('background/services/bridge/handlers/avalanche_bridgeAsset', () => {
  const bridgeServiceMock = {
    transferBtcAsset: jest.fn(),
    transferAsset: jest.fn(),
    createTransaction: jest.fn(),
    estimateGas: jest.fn(),
    bridgeConfig: mockBridgeConfig,
  } as any;

  const testActiveAccount: PrimaryAccount = {
    index: 0,
    type: AccountType.PRIMARY,
    id: 'active_account_ID',
    name: 'active account',
    addressBTC: 'BTC_address',
    addressC: 'C_address',
    walletId: 'wallet-id-1',
  };

  const accountsServiceMock = {
    activeAccount: testActiveAccount,
  } as any;

  const balanceAggregatorServiceMock = {
    updateBalancesForNetworks: jest.fn(),
    balances: {},
  } as any;

  const networkServiceMock = {
    isMainnet: jest.fn(),
    allNetworks: {
      promisify: jest.fn(),
    },
  } as any;

  const analyticsServicePosthogMock = {
    captureEncryptedEvent: jest.fn(),
  } as any;

  const btcAction: Action = {
    id: '123',
    jsonrpc: '2.0',
    time: Date.now(),
    status: ActionStatus.PENDING,
    displayData: {
      currentBlockchain: 'bitcoin',
      amountStr: '0.00024',
      asset: btcAsset,
    },
    method: 'avalanche_bridgeAsset',
    actionId: 'uuid',
  };

  const btcResult: BtcTransactionResponse = {
    hash: '123hash123',
    gasLimit: 1n,
    value: 2n,
    confirmations: 3,
    from: '123from123',
  };

  const ethAction: Action = {
    id: '987',
    jsonrpc: '2.0',
    time: Date.now(),
    status: ActionStatus.PENDING,
    displayData: {
      currentBlockchain: 'ethereum',
      amountStr: '0.0057',
      asset: {
        assetType: 0,
        coingeckoId: 'ethereum',
        denomination: 8,
        nativeNetwork: 'ethereum',
        symbol: 'ETH',
        tokenName: 'Ethereum',
        wrappedAssetSymbol: 'WETH',
      },
    },
    method: 'avalanche_bridgeAsset',
    actionId: 'uuid',
  };

  const ethResult: TransactionResponse = {
    hash: '987hash987',
    gasLimit: 9n,
    value: 8n,
    confirmations: async () => 7,
    from: '987from987',
    wait: jest.fn(),
    nonce: 9,
    data: '987data987',
    chainId: 8n,
  } as any as TransactionResponse;

  const openApprovalWindowSpy = jest.spyOn(
    DAppRequestHandler.prototype,
    'openApprovalWindow'
  );

  let handler: AvalancheBridgeAsset;

  const mockedEncryptResult = {
    data: 'testData',
    enc: 'testEnc',
    keyID: 'testKeyId',
  };

  beforeEach(() => {
    jest.resetAllMocks();
    bridgeServiceMock.transferBtcAsset.mockResolvedValue(btcResult);
    bridgeServiceMock.transferAsset.mockResolvedValue(ethResult);
    bridgeServiceMock.createTransaction.mockResolvedValue();
    openApprovalWindowSpy.mockResolvedValue(undefined);
    jest.mocked(getAssets).mockReturnValue({
      BTC: btcAsset,
      WETH: evmAsset,
      ETH: nativeAsset,
    });
    handler = new AvalancheBridgeAsset(
      bridgeServiceMock,
      accountsServiceMock,
      balanceAggregatorServiceMock,
      networkServiceMock,
      analyticsServicePosthogMock
    );
    (encryptAnalyticsData as jest.Mock).mockResolvedValue(mockedEncryptResult);
  });

  describe('handleAuthenticated', () => {
    const request = {
      id: 12,
      site: { tabId: 34 },
      method: DAppProviderRequest.AVALANCHE_BRIDGE_ASSET,
    };

    it('should return error when currentBlockchain is missing', async () => {
      const result = await handler.handleAuthenticated(request);

      expect(result).toEqual({
        ...request,
        error: 'Missing param: blockchain',
      });
      expect(openApprovalWindowSpy).toBeCalledTimes(0);
    });

    it('should return error when amount is missing', async () => {
      const result = await handler.handleAuthenticated({
        ...request,
        params: ['bitcoin'],
      });

      expect(result).toEqual({
        ...request,
        params: ['bitcoin'],
        error: 'Missing param: amount',
      });
      expect(openApprovalWindowSpy).toBeCalledTimes(0);
    });

    it('should return error when asset is missing and blockchain in not bitcoin', async () => {
      const result = await handler.handleAuthenticated({
        ...request,
        params: ['testBlockchain', '1'],
      });

      expect(result).toEqual({
        ...request,
        params: ['testBlockchain', '1'],
        error: 'Invalid param: unknown asset',
      });
      expect(openApprovalWindowSpy).toBeCalledTimes(0);
    });

    it('asset should be optional for bitcoin', async () => {
      const result = await handler.handleAuthenticated({
        ...request,
        params: ['bitcoin', '1'],
      });

      expect(result).toEqual({
        ...request,
        params: ['bitcoin', '1'],
        result: DEFERRED_RESPONSE,
      });
      expect(openApprovalWindowSpy).toBeCalledTimes(1);
      expect(openApprovalWindowSpy).toBeCalledWith(
        {
          ...request,
          params: ['bitcoin', '1'],
          displayData: {
            currentBlockchain: 'bitcoin',
            amountStr: '1',
            asset: btcAsset,
          },
          tabId: request.site.tabId,
        },
        `approve`
      );
    });

    it('should return error when asset is invalid', async () => {
      const mockRequest = {
        ...request,
        params: [
          Blockchain.AVALANCHE,
          '1',
          {
            assetType: 0,
            coingeckoId: 'testToken',
            denomination: 8,
            nativeNetwork: 'mockNetwork',
            symbol: 'TEST',
            tokenName: 'TestToken',
            wrappedAssetSymbol: 'WTEST',
            wrappedNetwork: 'testNetwork',
          },
        ],
      };
      const result = await handler.handleAuthenticated(mockRequest);

      expect(result).toEqual({
        ...mockRequest,
        error: 'Invalid param: unknown asset',
      });
      expect(openApprovalWindowSpy).toBeCalledTimes(0);
    });

    it('should return error when asset is for wrong chain', async () => {
      const mockRequest = {
        ...request,
        params: [Blockchain.ETHEREUM, '1', btcAsset],
      };
      const result = await handler.handleAuthenticated(mockRequest);

      expect(result).toEqual({
        ...mockRequest,
        error: 'Invalid param: asset',
      });
      expect(openApprovalWindowSpy).toBeCalledTimes(0);
    });

    it('should return error when native is for wrong chain', async () => {
      const mockRequest = {
        ...request,
        params: [Blockchain.AVALANCHE, '1', nativeAsset],
      };
      const result = await handler.handleAuthenticated(mockRequest);

      expect(result).toEqual({
        ...mockRequest,
        error: 'Invalid param: asset',
      });
      expect(openApprovalWindowSpy).toBeCalledTimes(0);
    });

    it('returns expected result', async () => {
      const estimatedGas = 12340n;

      jest
        .mocked(bridgeServiceMock.estimateGas)
        .mockResolvedValue(estimatedGas);

      const currentBlockchain = Blockchain.AVALANCHE;
      const amountStr = '0.1';

      const mockRequest = {
        id: 357,
        site: { tabId: 42 },
        method: DAppProviderRequest.AVALANCHE_BRIDGE_ASSET,
        params: [currentBlockchain, amountStr, { symbol: 'WETH' }],
      };

      const expectedAction = {
        ...mockRequest,
        displayData: {
          currentBlockchain,
          amountStr,
          asset: evmAsset,
          gasLimit: estimatedGas,
        },
        tabId: mockRequest.site.tabId,
      };

      const result = await handler.handleAuthenticated(mockRequest);

      expect(result).toEqual({
        ...mockRequest,
        result: DEFERRED_RESPONSE,
      });
      expect(openApprovalWindowSpy).toHaveBeenCalledWith(
        expectedAction,
        `approve`
      );
    });

    it('finds networks and token with balance for asset', async () => {
      jest.mocked(networkServiceMock.allNetworks.promisify).mockResolvedValue([
        {
          chainId: ChainId.BITCOIN,
          chainName: 'Bitcoin',
        },
        {
          chainId: 43113,
          chainName: 'Avalanche',
        },
        {
          chainId: 5,
          chainName: 'Ethereum',
        },
      ]);

      const balanceServiceMock = {
        ...balanceAggregatorServiceMock,
        balances: {
          [43113]: {
            C_address: {
              WETH: {
                symbol: 'WETH',
                type: TokenType.ERC20,
                balance: new BN(100),
                decimals: 1,
              },
            },
          },
        },
      };

      const handlerToTest = new AvalancheBridgeAsset(
        bridgeServiceMock,
        accountsServiceMock,
        balanceServiceMock,
        networkServiceMock,
        analyticsServicePosthogMock
      );

      const mockRequest = {
        id: 357,
        site: { tabId: 42 },
        method: DAppProviderRequest.AVALANCHE_BRIDGE_ASSET,
        params: [Blockchain.AVALANCHE, '0.1', { symbol: 'WETH' }],
      };

      const expectedAction = {
        ...mockRequest,
        displayData: {
          currentBlockchain: Blockchain.AVALANCHE,
          amountStr: '0.1',
          asset: evmAsset,
          sourceNetwork: {
            chainId: 43113,
            chainName: 'Avalanche',
          },
          targetNetwork: {
            chainId: 5,
            chainName: 'Ethereum',
          },
          token: {
            symbol: 'WETH',
            type: TokenType.ERC20,
            balance: new BN(100),
            decimals: 1,
          },
        },
        tabId: mockRequest.site.tabId,
      };
      const result = await handlerToTest.handleAuthenticated(mockRequest);

      expect(result).toEqual({
        ...mockRequest,
        result: DEFERRED_RESPONSE,
      });
      expect(openApprovalWindowSpy).toBeCalledWith(expectedAction, `approve`);
    });
  });

  describe('handleUnauthenticated', () => {
    it('return expected error', () => {
      const mockRequest = {
        id: 852,
        site: { tabId: 10 },
        method: DAppProviderRequest.AVALANCHE_BRIDGE_ASSET,
      };

      const result = handler.handleUnauthenticated(mockRequest);
      expect(result).toEqual({
        ...mockRequest,
        error: 'account not connected',
      });
    });
  });

  describe('onActionApproved', () => {
    it('uses custom gas settings if provided', async () => {
      networkServiceMock.isMainnet.mockReturnValue(false);

      const mockOnSuccess = jest.fn();
      const mockOnError = jest.fn();
      const amount = bnToBig(
        stringToBN(
          ethAction.displayData.amountStr,
          ethAction.displayData.asset.denomination
        ),
        ethAction.displayData.asset.denomination
      );

      const action = {
        ...ethAction,
        displayData: {
          ...ethAction.displayData,
          gasSettings: {
            maxFeePerGas: 1337,
            maxPriorityFeePerGas: 42,
          },
        },
      };

      const now = Date.now();
      jest.spyOn(Date, 'now').mockReturnValue(now);

      await handler.onActionApproved(
        action,
        {},
        mockOnSuccess,
        mockOnError,
        frontendTabId
      );

      expect(bridgeServiceMock.transferAsset).toHaveBeenCalledTimes(1);
      expect(bridgeServiceMock.transferAsset).toHaveBeenCalledWith(
        ethAction.displayData.currentBlockchain,
        amount,
        ethAction.displayData.asset,
        {
          maxFeePerGas: 1337,
          maxPriorityFeePerGas: 42,
        },
        frontendTabId
      );
    });

    it('transferBtcAsset is called when network is Bitcoin', async () => {
      networkServiceMock.isMainnet.mockReturnValue(true);

      const mockOnSuccess = jest.fn();
      const mockOnError = jest.fn();
      const amount = bnToBig(
        stringToBN(
          btcAction.displayData.amountStr,
          btcAction.displayData.asset.denomination
        ),
        btcAction.displayData.asset.denomination
      );
      const now = Date.now();
      jest.spyOn(Date, 'now').mockReturnValue(now);

      await handler.onActionApproved(
        btcAction,
        {},
        mockOnSuccess,
        mockOnError,
        frontendTabId
      );

      expect(bridgeServiceMock.transferBtcAsset).toBeCalledTimes(1);
      expect(bridgeServiceMock.transferBtcAsset).toBeCalledWith(
        amount,
        undefined,
        frontendTabId
      );

      expect(bridgeServiceMock.transferAsset).toBeCalledTimes(0);
      expect(bridgeServiceMock.createTransaction).toBeCalledTimes(1);
      expect(bridgeServiceMock.createTransaction).toBeCalledWith(
        Blockchain.BITCOIN,
        btcResult.hash,
        now,
        Blockchain.AVALANCHE,
        amount,
        'BTC'
      );

      expect(
        balanceAggregatorServiceMock.updateBalancesForNetworks
      ).toBeCalledWith([ChainId.BITCOIN], [testActiveAccount]);

      expect(mockOnSuccess).toBeCalledWith(btcResult);
      expect(mockOnError).toBeCalledTimes(0);
      expect(
        analyticsServicePosthogMock.captureEncryptedEvent
      ).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          name: 'avalanche_bridgeAsset_success',
          properties: {
            address: testActiveAccount.addressBTC,
            txHash: btcResult.hash,
            chainId: ChainId.BITCOIN,
          },
        })
      );
    });

    it('should call onError if transferBtcAsset throws errors', async () => {
      networkServiceMock.isMainnet.mockReturnValue(false);

      const error = new Error('error');
      bridgeServiceMock.transferBtcAsset.mockImplementation(() => {
        return Promise.reject(error);
      });

      const mockOnSuccess = jest.fn();
      const mockOnError = jest.fn();

      await handler.onActionApproved(btcAction, {}, mockOnSuccess, mockOnError);
      expect(bridgeServiceMock.createTransaction).toBeCalledTimes(0);

      expect(mockOnError).toBeCalledWith(error);
      expect(mockOnSuccess).toBeCalledTimes(0);

      expect(
        analyticsServicePosthogMock.captureEncryptedEvent
      ).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          name: 'avalanche_bridgeAsset_failed',
          properties: {
            address: testActiveAccount.addressBTC,
            chainId: ChainId.BITCOIN_TESTNET,
          },
        })
      );
    });

    it('transferAsset is called when network is not bitcoin', async () => {
      networkServiceMock.isMainnet.mockReturnValue(false);

      const mockOnSuccess = jest.fn();
      const mockOnError = jest.fn();
      const amount = bnToBig(
        stringToBN(
          ethAction.displayData.amountStr,
          ethAction.displayData.asset.denomination
        ),
        ethAction.displayData.asset.denomination
      );

      const now = Date.now();
      jest.spyOn(Date, 'now').mockReturnValue(now);

      await handler.onActionApproved(
        ethAction,
        {},
        mockOnSuccess,
        mockOnError,
        frontendTabId
      );

      expect(
        balanceAggregatorServiceMock.updateBalancesForNetworks
      ).toBeCalledTimes(0);

      expect(bridgeServiceMock.transferAsset).toBeCalledTimes(1);
      expect(bridgeServiceMock.transferAsset).toBeCalledWith(
        ethAction.displayData.currentBlockchain,
        amount,
        ethAction.displayData.asset,

        undefined,
        frontendTabId
      );
      expect(bridgeServiceMock.transferBtcAsset).toBeCalledTimes(0);
      expect(bridgeServiceMock.createTransaction).toBeCalledTimes(1);
      expect(bridgeServiceMock.createTransaction).toBeCalledWith(
        Blockchain.ETHEREUM,
        ethResult.hash,
        now,
        Blockchain.AVALANCHE,
        amount,
        'ETH'
      );
      expect(mockOnSuccess).toBeCalledWith(ethResult);
      expect(mockOnError).toBeCalledTimes(0);

      expect(
        analyticsServicePosthogMock.captureEncryptedEvent
      ).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          name: 'avalanche_bridgeAsset_success',
          properties: {
            address: testActiveAccount.addressC,
            txHash: ethResult.hash,
            chainId: ChainId.ETHEREUM_TEST_SEPOLIA,
          },
        })
      );
    });

    it('should call onError if transferAsset throws errors', async () => {
      networkServiceMock.isMainnet.mockReturnValue(true);

      const error = new Error('error');
      bridgeServiceMock.transferAsset.mockImplementation(() => {
        return Promise.reject(error);
      });

      const mockOnSuccess = jest.fn();
      const mockOnError = jest.fn();

      await handler.onActionApproved(ethAction, {}, mockOnSuccess, mockOnError);
      expect(bridgeServiceMock.createTransaction).toBeCalledTimes(0);

      expect(mockOnError).toBeCalledWith(error);
      expect(mockOnSuccess).toBeCalledTimes(0);

      expect(
        analyticsServicePosthogMock.captureEncryptedEvent
      ).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          name: 'avalanche_bridgeAsset_failed',
          properties: {
            address: testActiveAccount.addressC,
            chainId: ChainId.ETHEREUM_HOMESTEAD,
          },
        })
      );
    });
  });
});
