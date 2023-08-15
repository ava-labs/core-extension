export enum AccountType {
  PRIMARY = 'primary',
  IMPORTED = 'imported', // Imported using private key
  WALLET_CONNECT = 'walletConnect',
}

export enum ImportType {
  PRIVATE_KEY = 'privateKey',
  WALLET_CONNECT = 'walletConnect',
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

export interface WalletConnectAccount extends AccountStorageItem {
  type: AccountType.WALLET_CONNECT;
}

export type Account = PrimaryAccount | ImportedAccount | WalletConnectAccount;

export interface Accounts {
  active?: Account;
  primary: PrimaryAccount[];
  imported: Record<string, ImportedAccount | WalletConnectAccount>;
}

export const ACCOUNTS_STORAGE_KEY = 'accounts';

export enum AccountsEvents {
  ACCOUNTS_UPDATED = 'accounts-updated',
  ACTIVE_ACCOUNT_CHANGED = 'active-account-changed',
}
