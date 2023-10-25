import {
  AppConfigWithFullStaticFees,
  AssetType,
  BitcoinStaticFeeConfigAsset,
  Blockchain,
  EthereumStaticFeeAssetConfig,
  NativeAsset,
} from '@avalabs/bridge-sdk';

export const btcAsset: BitcoinStaticFeeConfigAsset = {
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
export const nativeAsset: NativeAsset = {
  symbol: 'ETH',
  tokenName: 'Ether',
  assetType: AssetType.NATIVE,
  nativeNetwork: Blockchain.ETHEREUM,
  wrappedAssetSymbol: 'WETH',
  denomination: 18,
  coingeckoId: 'ethereum',
};
export const evmAsset: EthereumStaticFeeAssetConfig = {
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
export const mockConfig: AppConfigWithFullStaticFees = {
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
    offboardDelaySeconds: 1,
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
