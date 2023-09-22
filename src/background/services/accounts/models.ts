import { PubKeyType } from '../wallet/models';

export enum AccountType {
  PRIMARY = 'primary',
  IMPORTED = 'imported', // Imported using private key
  WALLET_CONNECT = 'walletConnect',
}

export type ImportedAccountType = Exclude<AccountType, AccountType.PRIMARY>;

export enum ImportType {
  PRIVATE_KEY = 'privateKey',
  WALLET_CONNECT = 'walletConnect',
}
export const IMPORT_TYPE_TO_ACCOUNT_TYPE_MAP: Record<
  ImportType,
  ImportedAccountType
> = {
  [ImportType.PRIVATE_KEY]: AccountType.IMPORTED,
  [ImportType.WALLET_CONNECT]: AccountType.WALLET_CONNECT,
};

export type ImportData = PrivateKeyImportData | WalletConnectImportData;

export type WalletConnectAddresses = {
  addressC: string;
  addressBTC?: string;
  addressAVM?: string;
  addressPVM?: string;
  addressCoreEth?: string;
};

export type WalletConnectImportData = {
  importType: ImportType.WALLET_CONNECT;
  data: {
    addresses: WalletConnectAddresses;
    pubKey?: PubKeyType;
  };
};
export type PrivateKeyImportData = {
  importType: ImportType.PRIVATE_KEY;
  data: string;
};

export interface AccountStorageItem {
  id: string;
  name: string;
  addressBTC?: string;
  addressC: string;
  addressAVM?: string;
  addressPVM?: string;
  addressCoreEth?: string;
  type?: AccountType;
}

export interface PrimaryAccount extends AccountStorageItem {
  index: number;
  type: AccountType.PRIMARY;
  addressBTC: string;
}

export type ImportedAccount = ImportedPrivateKeyAccount | WalletConnectAccount;
export interface ImportedPrivateKeyAccount extends AccountStorageItem {
  type: AccountType.IMPORTED;
  addressBTC: string;
}

export interface WalletConnectAccount extends AccountStorageItem {
  type: AccountType.WALLET_CONNECT;
}

export type Account = PrimaryAccount | ImportedAccount;

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
