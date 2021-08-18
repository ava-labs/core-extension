import {
  getFromStorage,
  removeFromStorage,
  saveToStorage,
} from '@src/utils/storage/chrome-storage';
import { Transaction } from './models';

const TRANSACTIONS_STORAGE_KEY = 'transactions';

export function saveTransactionsToStorage(txs: Transaction[]) {
  return saveToStorage({ [TRANSACTIONS_STORAGE_KEY]: txs });
}

export function getTransactionsFromStorage() {
  return getFromStorage<Transaction[]>(TRANSACTIONS_STORAGE_KEY).then(
    (result) => {
      return result && result[TRANSACTIONS_STORAGE_KEY]
        ? result[TRANSACTIONS_STORAGE_KEY]
        : undefined;
    }
  );
}

export function removeAllTranscationsFromStorage() {
  return removeFromStorage(TRANSACTIONS_STORAGE_KEY);
}
