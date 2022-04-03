import {
  getFromStorage,
  saveToStorage,
} from '@src/utils/storage/chrome-storage';
import { ActiveNetwork, supportedNetworks } from './models';

export const NETWORK_STORAGE_KEY = 'network';

export const getNetworkFromStorage = () =>
  getFromStorage<string>(NETWORK_STORAGE_KEY).then((network) => {
    return supportedNetworks.get(network || '');
  });

export function saveNetworkToStorage(net: ActiveNetwork) {
  return saveToStorage(NETWORK_STORAGE_KEY, net.name);
}
