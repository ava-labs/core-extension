export enum NetworkEvents {
  NETWORK_UPDATE_EVENT = 'network-updated',
  NETWORKS_UPDATED_EVENT = 'networks-updated',
}

export const NETWORK_STORAGE_KEY = 'NETWORK_STORAGE_KEY';
export const NETWORK_LIST_STORAGE_KEY = 'NETWORK_LIST_STORAGE_KEY';

export interface NetworkStorage {
  activeNetworkId: number | null;
  isDeveloperMode: boolean;
}
