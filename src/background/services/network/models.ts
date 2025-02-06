import type { Network as _Network } from '@avalabs/core-chains-sdk';
import type { EnsureDefined, PartialBy } from '@src/background/models';

export enum NetworkEvents {
  NETWORK_UPDATE_EVENT = 'network-updated',
  DEVELOPER_MODE_CHANGED = 'developer-mode-changed',
  NETWORKS_UPDATED_EVENT = 'networks-updated',
}

export const NETWORK_STORAGE_KEY = 'NETWORK_STORAGE_KEY';
export const NETWORK_LIST_STORAGE_KEY = 'NETWORK_LIST_STORAGE_KEY';
export const NETWORK_OVERRIDES_STORAGE_KEY = 'NETWORK_OVERRIDES_STORAGE_KEY';

export interface NetworkStorage {
  favoriteNetworks: number[];
  customNetworks: Record<number, Network>;
  dappScopes: Record<string, string>;
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
  isTestnet?: boolean;
  requiresGlacierApiKey?: boolean;
}

export type Network = _Network &
  AdvancedNetworkConfig & {
    caipId?: string;
  };

export type NetworkWithCaipId = EnsureDefined<Network, 'caipId'>;

export type ChainList = Record<string, Network>;
export type ChainListWithCaipIds = Record<string, NetworkWithCaipId>;

export type NetworkOverrides = PartialBy<Network, 'rpcUrl'> &
  AdvancedNetworkConfig;

export type CustomRpcHeaders = Record<string, string>;

export type AdvancedNetworkConfig = {
  customRpcHeaders?: CustomRpcHeaders;
};

export type CustomNetworkPayload = Network & {
  chainId: number | string; // Chain ID may come in hex-encoded through wallet_addEthereumChain call.
};

export type AddEthereumChainDisplayData = {
  network: EnsureDefined<Network, 'caipId'>;
  options: {
    requiresGlacierApiKey: boolean;
  };
};

export const PLACEHOLDER_RPC_HEADERS = { '': '' };
