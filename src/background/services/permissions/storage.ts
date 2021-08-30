import {
  getFromStorage,
  removeFromStorage,
  saveToStorage,
} from '@src/utils/storage/chrome-storage';
import { Permissions } from './models';

const PERMISSION_STORAGE_KEY = 'permissions';

export const savePermissionsToStorage = (permissions: Permissions) =>
  saveToStorage({ [PERMISSION_STORAGE_KEY]: permissions });

export const getPermissionsFromStorage = () =>
  getFromStorage<{ permissions: Permissions }>(PERMISSION_STORAGE_KEY).then(
    (storage) => storage.permissions
  );

export function removeAllPermissionsFromStorage() {
  return removeFromStorage(PERMISSION_STORAGE_KEY);
}
