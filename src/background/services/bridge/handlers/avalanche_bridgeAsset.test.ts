import {
  AppConfigWithFullStaticFees,
  AssetType,
  BitcoinStaticFeeConfigAsset,
  Blockchain,
  BridgeConfig,
  NativeAsset,
  getAssets,
  EthereumStaticFeeAssetConfig,
} from '@avalabs/bridge-sdk';
import { ChainId } from '@avalabs/chains-sdk';
import { bnToBig, stringToBN } from '@avalabs/utils-sdk';
import { TransactionResponse } from '@ethersproject/providers';
import { DAppRequestHandler } from '@src/background/connections/dAppConnection/DAppRequestHandler';
import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { DEFERRED_RESPONSE } from '@src/background/connections/middlewares/models';
import { BigNumber } from 'ethers';
import { AccountType, PrimaryAccount } from '../../accounts/models';
import { BtcTransactionResponse } from '../models';
import { Action, ActionStatus } from './../../actions/models';
import { AvalancheBridgeAsset } from './avalanche_bridgeAsset';
import { TokenType } from '../../balances/models';
import { BN } from 'bn.js';

jest.mock('@avalabs/bridge-sdk', () => {
  const originalModule = jest.requireActual('@avalabs/bridge-sdk');
  return {
    ...originalModule,
    getAssets: jest.fn(),
  };
});

const frontendTabId = 654;

const btcAsset: BitcoinStaticFeeConfigAsset = {
  additionalTxFeeAmount: 0,
  avaxPromotionAmount: '100000000000000000',
  avaxPromotionDollarThreshold: 50,
  bech32AddressPrefix: 'tb',
  offboardFeeDollars: 10,
  onboardFeeDollars: 3,
  operatorAddress: 'tb1qcsq9k2qxf4sr5zewxvn79g7wpc08xrtecsr3zc',
  privateKeyPrefix: 'EF',
  reserveBalanceHighWaterMark: 200000000,
  reserveBalanceLowWaterMark: 100000000,
  targetChangeAmount: 5000000,
  tokenName: 'Bitcoin',
  wrappedContractAddress: '0x0f2071079315ba5a1c6d5b532a01a132c157ac83',
  wrappedNetwork: 'avalanche',
  assetType: AssetType.BTC,
  symbol: 'BTC',
  denomination: 8,
  nativeNetwork: Blockchain.BITCOIN,
};
const nativeAsset: NativeAsset = {
  symbol: 'ETH',
  tokenName: 'Ether',
  assetType: AssetType.NATIVE,
  nativeNetwork: Blockchain.ETHEREUM,
  wrappedAssetSymbol: 'WETH',
  denomination: 18,
  coingeckoId: 'ethereum',
};
const evmAsset: EthereumStaticFeeAssetConfig = {
  assetType: AssetType.ERC20,
  symbol: 'WETH',
  avaxPromotionAmount: '100000000000000000',
  avaxPromotionDollarThreshold: 1,
  chainlinkFeedAddress: '0x0000000000000000000000000000000000000000',
  chainlinkFeedNetwork: 'ethereum',
  denomination: 18,
  ipfsHash: '0000000000000000000000000000000000000000000000000000000000000000',
  nativeContractAddress: '0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6',
  nativeNetwork: Blockchain.ETHEREUM,
  offboardFeeProcessThreshold: '1000000000000000000',
  tokenName: 'Wrapped Ether',
  transferGasLimit: 70000,
  offboardFeeDollars: 10,
  wrappedContractAddress: '0x678c4c42572ec1c44b144c5a6712b69d2a5d412c',
  wrappedNetwork: Blockchain.AVALANCHE,
};

const mockConfig: AppConfigWithFullStaticFees = {
  critical: {
    operationMode: 'normal',
    assets: {
      WETH: evmAsset,
    },
    disableFrontend: false,
    networks: { avalanche: 43113, ethereum: 5 },
    operatorAddress: 'normal',
    walletAddresses: {
      avalanche: 'avalancheAddress',
      ethereum: 'ethereumAddress',
    },
    addressBlocklist: [],
  },
  nonCritical: {
    minimumConfirmations: {
      avalanche: 1,
      ethereum: 96,
    },
    wrapFeeApproximation: {},
    unwrapFeeApproximation: {},
    currentEthPrice: '325000000000',
    currentAvaxPrice: '4000000000',
    currentGasPrices: {
      avalanche: {
        nextBaseFee: '28125000000',
        suggestedTip: '2000000000',
      },
      ethereum: {
        nextBaseFee: '14743549',
        suggestedTip: '7000693915',
      },
    },
    updated: 'updated',
    startupTime: 'startupTime',
  },
  criticalBitcoin: {
    operatorAddress: '0xF759607ffee4B5482492927E51D3b7820DE4189d',
    addressBlocklist: [],
    avalancheChainId: 43113,
    bitcoinAssets: {
      btc: btcAsset,
    },
    disableFrontend: false,
    operationMode: 'normal',
    operatorEvmAddress: 'operatorEvmAddress',
    useEip1559TransactionFormat: true,
    walletAddresses: {
      avalanche: 'avalancheAddress',
      btc: 'btcAddress',
    },
  },
  nonCriticalBitcoin: {
    networkInfo: {
      btc: {
        minimumConfirmations: 4,
        minimumOnboardSize: 2000,
        currentPrice: '5000000000000',
        currentFeeRate: {
          feeRate: 10,
          source: 'smartFeeEstimate',
        },
        currentUtxoStatistics: {
          tb1q8nur2k3xphnsqa5zxgjl7djtkj3ya0gfs96nxk: {
            mean: '2271118',
            count: '32',
          },
        },
        currentBridgeFeeEstimate: {
          wrapFeeAmount: 6000,
          constUnwrapFeeAmount: 21050,
          unwrapFeeNumerator: 680,
          unwrapFeeDenominator: 2271118,
          dustThreshold: 1000,
        },
        reserveBalance: 1436210,
        networkView: {
          lastIndexedBlock: 2419333,
          lastSeenBlock: 2419336,
          nodeVersion: '/Satoshi:24.0.1/',
        },
      },
    },
    updated: 'updated time',
  },
  startupTime: 'timestamp',
  version: '0.0.1',
};
const mockBridgeConfig: BridgeConfig = { config: mockConfig };

describe('background/services/bridge/handlers/avalanche_bridgeAsset', () => {
  const bridgeServiceMock = {
    transferBtcAsset: jest.fn(),
    transferAsset: jest.fn(),
    createTransaction: jest.fn(),
    bridgeConfig: mockBridgeConfig,
  } as any;

  const testActiveAccount: PrimaryAccount = {
    index: 0,
    type: AccountType.PRIMARY,
    id: 'active_account_ID',
    name: 'active account',
    addressBTC: 'BTC_address',
    addressC: 'C_address',
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
    gasLimit: BigNumber.from(1),
    value: BigNumber.from(2),
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
    gasLimit: BigNumber.from(9),
    value: BigNumber.from(8),
    confirmations: 7,
    from: '987from987',
    wait: jest.fn(),
    nonce: 9,
    data: '987data987',
    chainId: 8,
  };

  const openApprovalWindowSpy = jest.spyOn(
    DAppRequestHandler.prototype,
    'openApprovalWindow'
  );

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
  });

  describe('handleAuthenticated', () => {
    const request = {
      id: 12,
      site: { tabId: 34 },
      method: DAppProviderRequest.AVALANCHE_BRIDGE_ASSET,
    };

    it('should return error when currentBlockchain is missing', async () => {
      const handler = new AvalancheBridgeAsset(
        bridgeServiceMock,
        accountsServiceMock,
        balanceAggregatorServiceMock,
        networkServiceMock
      );
      const result = await handler.handleAuthenticated(request);

      expect(result).toEqual({
        ...request,
        error: 'Missing param: blockchain',
      });
      expect(openApprovalWindowSpy).toBeCalledTimes(0);
    });

    it('should return error when amount is missing', async () => {
      const handler = new AvalancheBridgeAsset(
        bridgeServiceMock,
        accountsServiceMock,
        balanceAggregatorServiceMock,
        networkServiceMock
      );
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
      const handler = new AvalancheBridgeAsset(
        bridgeServiceMock,
        accountsServiceMock,
        balanceAggregatorServiceMock,
        networkServiceMock
      );
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
      const handler = new AvalancheBridgeAsset(
        bridgeServiceMock,
        accountsServiceMock,
        balanceAggregatorServiceMock,
        networkServiceMock
      );
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
      const handler = new AvalancheBridgeAsset(
        bridgeServiceMock,
        accountsServiceMock,
        balanceAggregatorServiceMock,
        networkServiceMock
      );
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
      const handler = new AvalancheBridgeAsset(
        bridgeServiceMock,
        accountsServiceMock,
        balanceAggregatorServiceMock,
        networkServiceMock
      );
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
      const handler = new AvalancheBridgeAsset(
        bridgeServiceMock,
        accountsServiceMock,
        balanceAggregatorServiceMock,
        networkServiceMock
      );
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
        },
        tabId: mockRequest.site.tabId,
      };
      const handler = new AvalancheBridgeAsset(
        bridgeServiceMock,
        accountsServiceMock,
        balanceAggregatorServiceMock,
        networkServiceMock
      );

      const result = await handler.handleAuthenticated(mockRequest);

      expect(result).toEqual({
        ...mockRequest,
        result: DEFERRED_RESPONSE,
      });
      expect(openApprovalWindowSpy).toBeCalledWith(expectedAction, `approve`);
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
      const handler = new AvalancheBridgeAsset(
        bridgeServiceMock,
        accountsServiceMock,
        balanceServiceMock,
        networkServiceMock
      );

      const result = await handler.handleAuthenticated(mockRequest);

      expect(result).toEqual({
        ...mockRequest,
        result: DEFERRED_RESPONSE,
      });
      expect(openApprovalWindowSpy).toBeCalledWith(expectedAction, `approve`);
    });
  });

  describe('handleAuthenticated', () => {
    it('return expected error', () => {
      const handler = new AvalancheBridgeAsset(
        bridgeServiceMock,
        accountsServiceMock,
        balanceAggregatorServiceMock,
        networkServiceMock
      );
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
    it('transferBtcAsset is called when network is Bitcoin', async () => {
      networkServiceMock.isMainnet.mockReturnValue(true);

      const handler = new AvalancheBridgeAsset(
        bridgeServiceMock,
        accountsServiceMock,
        balanceAggregatorServiceMock,
        networkServiceMock
      );

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
    });

    it('should call onError if transferBtcAsset throws errors', async () => {
      const error = new Error('error');
      bridgeServiceMock.transferBtcAsset.mockImplementation(() => {
        return Promise.reject(error);
      });

      const handler = new AvalancheBridgeAsset(
        bridgeServiceMock,
        accountsServiceMock,
        balanceAggregatorServiceMock,
        networkServiceMock
      );

      const mockOnSuccess = jest.fn();
      const mockOnError = jest.fn();

      await handler.onActionApproved(btcAction, {}, mockOnSuccess, mockOnError);
      expect(bridgeServiceMock.createTransaction).toBeCalledTimes(0);

      expect(mockOnError).toBeCalledWith(error);
      expect(mockOnSuccess).toBeCalledTimes(0);
    });

    it('transferAsset is called when network is not bitcoin', async () => {
      const handler = new AvalancheBridgeAsset(
        bridgeServiceMock,
        accountsServiceMock,
        balanceAggregatorServiceMock,
        networkServiceMock
      );

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
    });

    it('should call onError if transferAsset throws errors', async () => {
      const error = new Error('error');
      bridgeServiceMock.transferAsset.mockImplementation(() => {
        return Promise.reject(error);
      });

      const handler = new AvalancheBridgeAsset(
        bridgeServiceMock,
        accountsServiceMock,
        balanceAggregatorServiceMock,
        networkServiceMock
      );

      const mockOnSuccess = jest.fn();
      const mockOnError = jest.fn();

      await handler.onActionApproved(ethAction, {}, mockOnSuccess, mockOnError);
      expect(bridgeServiceMock.createTransaction).toBeCalledTimes(0);

      expect(mockOnError).toBeCalledWith(error);
      expect(mockOnSuccess).toBeCalledTimes(0);
    });
  });
});
