import {
  getFromStorage,
  removeFromStorage,
  saveToStorage,
} from '@src/utils/storage/chrome-storage';
import { BridgeState } from './models';
import { deserializeBridgeState } from './utils';

const BRIDGE_STORAGE_KEY = 'bridge';

export function saveBridgeStateToStorage(state: BridgeState) {
  return saveToStorage(BRIDGE_STORAGE_KEY, state);
}

export const getBridgeStateFromStorage = (): Promise<BridgeState | undefined> =>
  getFromStorage<BridgeState>(BRIDGE_STORAGE_KEY).then((bridgeState) => {
    try {
      return deserializeBridgeState(bridgeState);
    } catch {
      removeBridgeStateFromStorage();
    }
  });

export function removeBridgeStateFromStorage() {
  return removeFromStorage(BRIDGE_STORAGE_KEY);
}
