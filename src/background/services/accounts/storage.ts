import {
  getFromStorage,
  removeFromStorage,
  saveToStorage,
} from '@src/utils/storage/chrome-storage';

interface AccountState {
  [key: string]: string;
}
const ACCOUNTS_STORAGE_KEY = 'accounts';

export const saveAccountsToStorage = (accounts: AccountState) =>
  saveToStorage({ [ACCOUNTS_STORAGE_KEY]: accounts });

export const getAccountsFromStorage = () =>
  getFromStorage<{ accounts: AccountState }>(ACCOUNTS_STORAGE_KEY).then(
    (storage) => storage.accounts
  );

export function removeAllAccountsFromStorage() {
  return removeFromStorage(ACCOUNTS_STORAGE_KEY);
}
