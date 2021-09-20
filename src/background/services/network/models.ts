import { Network, NetworkConstants } from '@avalabs/avalanche-wallet-sdk';

export interface ActiveNetwork {
  config: Network.NetworkConfig;
  name: string;
  chainId: string;
}

export const MAINNET_NETWORK = {
  config: NetworkConstants.MainnetConfig,
  name: 'Avalanche Mainnet',
  chainId: '0xa86a',
};
export const FUJI_NETWORK = {
  config: NetworkConstants.TestnetConfig,
  name: ' Avalanche FUJI',
  chainId: '0xa869',
};
export const LOCAL_NETWORK = {
  config: NetworkConstants.LocalnetConfig,
  name: 'Avalanche Local',
  chainId: '43112',
};

export const supportedNetworks = new Map<string, ActiveNetwork>([
  [MAINNET_NETWORK.name, MAINNET_NETWORK],
  [FUJI_NETWORK.name, FUJI_NETWORK],
  [LOCAL_NETWORK.name, LOCAL_NETWORK],
]);
