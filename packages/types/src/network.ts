import { Network as _Network, NetworkVMType } from '@avalabs/core-chains-sdk';
import { EnsureDefined, PartialBy } from './util-types';

export enum NetworkEvents {
  NETWORK_UPDATE_EVENT = 'network-updated',
  DEVELOPER_MODE_CHANGED = 'developer-mode-changed',
  NETWORKS_UPDATED_EVENT = 'networks-updated',
}

export const NETWORK_STORAGE_KEY = 'NETWORK_STORAGE_KEY';
export const NETWORK_LIST_STORAGE_KEY = 'NETWORK_LIST_STORAGE_KEY';
export const NETWORK_OVERRIDES_STORAGE_KEY = 'NETWORK_OVERRIDES_STORAGE_KEY';

export interface NetworkAvailability {
  [chainId: number]: {
    isEnabled: boolean;
  };
}

export interface NetworkStorage {
  /**
   * @deprecated For Legacy app only. For NextGen app please use "networkAvailability" field
   */
  favoriteNetworks: number[];
  customNetworks: Record<number, Network>;
  dappScopes: Record<string, string>;
  networkAvailability: NetworkAvailability;
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

export type EvmNetwork = NetworkWithCaipId & { vmName: NetworkVMType.EVM };
export type BtcNetwork = NetworkWithCaipId & { vmName: NetworkVMType.BITCOIN };
export type SolanaNetwork = NetworkWithCaipId & {
  vmName: NetworkVMType.SVM;
};

export type AvalancheNetwork = NetworkWithCaipId & {
  vmName: NetworkVMType.AVM | NetworkVMType.PVM | NetworkVMType.CoreEth;
};
export type CoreEthNetwork = NetworkWithCaipId & {
  vmName: NetworkVMType.CoreEth;
};

export const isEvmNetwork = (
  network: NetworkWithCaipId,
): network is EvmNetwork => network.vmName === NetworkVMType.EVM;

export const isBtcNetwork = (
  network: NetworkWithCaipId,
): network is BtcNetwork => network.vmName === NetworkVMType.BITCOIN;

export const isSolanaNetwork = (
  network: NetworkWithCaipId,
): network is SolanaNetwork => network.vmName === NetworkVMType.SVM;

export const isCoreEthNetwork = (
  network: NetworkWithCaipId,
): network is CoreEthNetwork => network.vmName === NetworkVMType.CoreEth;

export const isAvalancheNetwork = (
  network: NetworkWithCaipId,
): network is AvalancheNetwork =>
  network.vmName === NetworkVMType.AVM ||
  network.vmName === NetworkVMType.PVM ||
  network.vmName === NetworkVMType.CoreEth;
