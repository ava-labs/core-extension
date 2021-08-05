import {
  getFromStorage,
  saveToStorage,
} from '@src/utils/storage/chrome-storage';
import { ActiveNetwork, MAINNET_NETWORK, supportedNetworks } from './models';

export const NETWORK_STORAGE_KEY = 'network';

export const getNetworkFromStorage = () =>
  getFromStorage<{ network: string }>(NETWORK_STORAGE_KEY).then((result) => {
    const { network } = result;
    return supportedNetworks.get(network) || MAINNET_NETWORK;
  });

export function saveNetworkToStorage(net: ActiveNetwork) {
  return saveToStorage({ [NETWORK_STORAGE_KEY]: net.name });
}
