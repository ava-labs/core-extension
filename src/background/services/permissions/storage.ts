import {
  getFromStorage,
  saveToStorage,
} from '@src/utils/storage/chrome-storage';
import { Permissions } from './models';

const PERMISSION_STORAGE_KEY = 'permissions';

export const savePermissionsToStorage = (permissions: Permissions) =>
  saveToStorage(PERMISSION_STORAGE_KEY, permissions);

export const getPermissionsFromStorage = () =>
  getFromStorage<Permissions>(PERMISSION_STORAGE_KEY).then(
    (permissions) => permissions || {}
  );
