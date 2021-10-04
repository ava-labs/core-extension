import {
  getFromStorage,
  removeFromStorage,
  saveToStorage,
} from '@src/utils/storage/chrome-storage';
import { SettingsState } from './models';

const SETTINGS_STORAGE_KEY = 'settings';

export const saveSettingsToStorage = (settings: SettingsState) =>
  saveToStorage({ [SETTINGS_STORAGE_KEY]: settings });

export const getSettingsFromStorage = () =>
  getFromStorage<{ settings: SettingsState }>(SETTINGS_STORAGE_KEY).then(
    (storage) => storage.settings
  );

export function removeAllSettingsFromStorage() {
  return removeFromStorage(SETTINGS_STORAGE_KEY);
}
