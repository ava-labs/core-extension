import {
  NetworkConfig,
  MainnetConfig,
  TestnetConfig,
  LocalnetConfig,
} from '@avalabs/avalanche-wallet-sdk';

export interface ActiveNetwork {
  config: NetworkConfig;
  name: string;
  chainId: string;
}

export const MAINNET_NETWORK = {
  config: MainnetConfig,
  name: 'Avalanche Mainnet',
  chainId: '0xa86a',
};
export const FUJI_NETWORK = {
  config: TestnetConfig,
  name: ' Avalanche FUJI',
  chainId: '0xa869',
};
export const LOCAL_NETWORK = {
  config: LocalnetConfig,
  name: 'Avalanche Local',
  chainId: '43112',
};

export const supportedNetworks = new Map<string, ActiveNetwork>([
  [MAINNET_NETWORK.name, MAINNET_NETWORK],
  [FUJI_NETWORK.name, FUJI_NETWORK],
  [LOCAL_NETWORK.name, LOCAL_NETWORK],
]);

export const supportedNetworksByChainID = Array.from(
  supportedNetworks.values()
).reduce(
  (agg, network) => agg.set(network.chainId, network),
  new Map<string, ActiveNetwork>()
);
