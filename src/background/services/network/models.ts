import { Network } from '@avalabs/chains-sdk';

export enum NetworkEvents {
  NETWORK_UPDATE_EVENT = 'network-updated',
  NETWORKS_UPDATED_EVENT = 'networks-updated',
}

export const NETWORK_STORAGE_KEY = 'NETWORK_STORAGE_KEY';
export const NETWORK_LIST_STORAGE_KEY = 'NETWORK_LIST_STORAGE_KEY';

export interface NetworkStorage {
  activeNetworkId: number | null;
  isDeveloperMode: boolean;
  favoriteNetworks: number[];
  customNetworks: Record<number, Network>;
}

export interface AddEthereumChainParameter {
  chainId: string;
  blockExplorerUrls?: string[];
  chainName?: string;
  iconUrls?: string[];
  nativeCurrency?: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls?: string[];
}
