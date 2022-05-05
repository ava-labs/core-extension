import {
  NetworkConfig,
  MainnetConfig,
  TestnetConfig,
  LocalnetConfig,
  BN,
} from '@avalabs/avalanche-wallet-sdk';

/**
 * Entering into multichain the networks need to be cleaned up
 * here is the story to do so @link https://ava-labs.atlassian.net/browse/CP-1872
 */
export interface NativeToken {
  name: string;
  symbol: string;
  balance?: BN;
  denomination: number;
  coinId: string;
}

export enum NetworkVM {
  EVM = 'NetworkVM:EVM',
  BITCOIN = 'NetworkVM:BITCOIN',
}

export const AVAX_TOKEN: NativeToken = {
  name: 'Avalanche',
  symbol: 'AVAX',
  balance: new BN(0),
  denomination: 18,
  coinId: 'avalanche-2',
};
export const BTC_TOKEN: NativeToken = {
  name: 'Bitoin',
  symbol: 'BTC',
  balance: new BN(0),
  denomination: 8,
  coinId: 'bitcoin',
};

export interface ActiveNetwork {
  config: NetworkConfig;
  name: string;
  chainId: string;
  nativeToken: NativeToken;
  vm: NetworkVM;
}
export interface CustomNetwork extends ActiveNetwork {
  rpcUrl?: string;
}

export const MAINNET_NETWORK: ActiveNetwork = {
  config: MainnetConfig,
  name: 'Avalanche Mainnet',
  chainId: 43114 as any,
  nativeToken: AVAX_TOKEN,
  vm: NetworkVM.EVM,
};

export const FUJI_NETWORK: ActiveNetwork = {
  config: TestnetConfig,
  name: ' Avalanche FUJI',
  chainId: 43113 as any,
  nativeToken: AVAX_TOKEN,
  vm: NetworkVM.EVM,
};

export const BITCOIN_NETWORK: ActiveNetwork = {
  config: MainnetConfig,
  name: 'Bitcoin Mainnet',
  chainId: 'btc',
  nativeToken: BTC_TOKEN,
  vm: NetworkVM.BITCOIN,
};
export const BITCOIN_TEST_NETWORK: ActiveNetwork = {
  config: TestnetConfig,
  name: 'Bitcoin Testnet',
  chainId: 'btc-testnet',
  nativeToken: BTC_TOKEN,
  vm: NetworkVM.BITCOIN,
};

export const LOCAL_NETWORK: ActiveNetwork = {
  config: LocalnetConfig,
  name: 'Avalanche Local',
  chainId: '43112',
  nativeToken: AVAX_TOKEN,
  vm: NetworkVM.EVM,
};

export type NetworkTypes =
  | ActiveNetwork
  | CustomNetwork
  | typeof BITCOIN_NETWORK;

export function isActiveNetwork(
  network: NetworkTypes
): network is ActiveNetwork {
  // eslint-disable-next-line no-prototype-builtins
  return !!network && network.hasOwnProperty('config');
}

export function isCustomNetwork(
  network: NetworkTypes
): network is CustomNetwork {
  // eslint-disable-next-line no-prototype-builtins
  return !!network && network.hasOwnProperty('rpcUrl');
}

export const supportedNetworks = new Map<string, ActiveNetwork>([
  [MAINNET_NETWORK.name, MAINNET_NETWORK],
  [FUJI_NETWORK.name, FUJI_NETWORK],
  [BITCOIN_NETWORK.name, BITCOIN_NETWORK],
  [LOCAL_NETWORK.name, LOCAL_NETWORK],
]);

export const supportedNetworksByChainID = Array.from(
  supportedNetworks.values()
).reduce(
  (agg, network) => agg.set(network.chainId, network),
  new Map<string, ActiveNetwork>()
);

export enum NetworkEvents {
  NETWORK_UPDATE_EVENT = 'network-updated',
}

export const NETWORK_STORAGE_KEY = 'network';
