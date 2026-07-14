import { Network, NetworkVMType } from '@avalabs/core-chains-sdk';
import {
  HYPERCORE_CHAIN_ID,
  HYPERCORE_CHAIN_NAME,
  HYPEREVM_CHAIN_ID,
  HYPEREVM_CHAIN_NAME,
} from '@core/common';

const HYPERLIQUID_LOGO_URL =
  'https://assets.coingecko.com/coins/images/50882/standard/hyperliquid.jpg';
const HYPERLIQUID_PRIMARY_COLOR = '#97FCE4';

export const HYPEREVM_NETWORK: Network = {
  chainName: HYPEREVM_CHAIN_NAME,
  chainId: HYPEREVM_CHAIN_ID,
  vmName: NetworkVMType.EVM,
  description: '',
  rpcUrl: 'https://proxy-api.avax.network/proxy/nownodes/hype/evm',
  isTestnet: false,
  networkToken: {
    name: 'Hyperliquid',
    symbol: 'HYPE',
    description: '',
    decimals: 18,
    logoUri: HYPERLIQUID_LOGO_URL,
  },
  logoUri: HYPERLIQUID_LOGO_URL,
  primaryColor: HYPERLIQUID_PRIMARY_COLOR,
  explorerUrl: 'https://hyperevmscan.io',
  utilityAddresses: {
    multicall: '0xca11bde05977b3631167028862be2a173976ca11',
  },
  pricingProviders: {
    coingecko: {
      assetPlatformId: 'hyperevm',
      nativeTokenId: 'hyperliquid',
    },
  },
};

export const HYPERCORE_NETWORK: Network = {
  chainName: HYPERCORE_CHAIN_NAME,
  chainId: HYPERCORE_CHAIN_ID,
  // chains-sdk NetworkVMType has no HYPERCORE yet; CAIP (`caip2Id`) is the
  // routing source of truth for ModuleManager → @avalabs/hypercore-module.
  // Address resolution still uses addressC via the EVM branch until chains-sdk
  // / BalancesService gain an explicit HYPERCORE case.
  vmName: NetworkVMType.EVM,
  caip2Id: 'hlcore:mainnet',
  description: '',
  rpcUrl: '',
  isTestnet: false,
  networkToken: {
    name: 'USD Coin',
    symbol: 'USDC',
    description: '',
    decimals: 8,
    logoUri: 'https://assets.coingecko.com/coins/images/6319/standard/usdc.png',
  },
  logoUri: HYPERLIQUID_LOGO_URL,
  primaryColor: HYPERLIQUID_PRIMARY_COLOR,
  explorerUrl: 'https://app.hyperliquid.xyz/explorer',
  pricingProviders: {
    coingecko: {
      nativeTokenId: 'usd-coin',
    },
  },
};
