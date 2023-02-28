export enum AccountType {
  PRIMARY = 'primary',
  IMPORTED = 'imported',
}

export enum ImportType {
  PRIVATE_KEY = 'privateKey',
}

export interface ImportData {
  importType: ImportType;
  data: string;
}

export interface AccountStorageItem {
  id: string;
  name: string;
  addressBTC: string;
  addressC: string;
  addressAVM?: string;
  addressPVM?: string;
  addressCoreEth?: string;
  type?: AccountType;
}

export interface PrimaryAccount extends AccountStorageItem {
  index: number;
  type: AccountType.PRIMARY;
}

export interface ImportedAccount extends AccountStorageItem {
  type: AccountType.IMPORTED;
}

export type Account = PrimaryAccount | ImportedAccount;

export interface Accounts {
  active?: Account;
  primary: PrimaryAccount[];
  imported: Record<string, ImportedAccount>;
}

export const ACCOUNTS_STORAGE_KEY = 'accounts';

export enum AccountsEvents {
  ACCOUNTS_UPDATED = 'accounts-updated',
  ACTIVE_ACCOUNT_CHANGED = 'active-account-changed',
}
