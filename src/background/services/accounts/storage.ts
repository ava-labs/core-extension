import {
  getFromStorage,
  removeFromStorage,
  saveToStorage,
} from '@src/utils/storage/chrome-storage';
import { Account } from './models';

interface AccountState {
  accounts: Account[];
}
const ACCOUNTS_STORAGE_KEY = 'accounts';

export const saveAccountsToStorage = (accounts: Account[]) =>
  saveToStorage({ [ACCOUNTS_STORAGE_KEY]: { accounts } });

export const getAccountsFromStorage = (): Promise<AccountState | undefined> =>
  getFromStorage<{ accounts: AccountState }>(ACCOUNTS_STORAGE_KEY).then(
    (storage) => storage.accounts
  );

export function removeAllAccountsFromStorage() {
  return removeFromStorage(ACCOUNTS_STORAGE_KEY);
}
