export interface AccountStorageItem {
  index: number;
  name: string;
  active: boolean;
}

export interface Account extends AccountStorageItem {
  addressBTC: string;
  addressC: string;
  balance?: string;
}

export const ACCOUNTS_STORAGE_KEY = 'accounts';

export enum AccountsEvents {
  ACCOUNTS_UPDATED = 'accounts-updated',
}
