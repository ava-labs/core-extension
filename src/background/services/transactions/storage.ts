import {
  getFromStorage,
  saveToStorage,
} from '@src/utils/storage/chrome-storage';
import { Transaction } from './models';

const TRANSACTIONS_STORAGE_KEY = 'transactions';

export function saveTransactionsToStorage(txs: Transaction[]) {
  return saveToStorage(TRANSACTIONS_STORAGE_KEY, txs);
}

export function getTransactionsFromStorage() {
  return getFromStorage<Transaction[]>(TRANSACTIONS_STORAGE_KEY);
}
