import { PartialBy } from '@avalabs/vm-module-types';

import { PubKeyType } from './wallet';

export enum AccountType {
  PRIMARY = 'primary',
  IMPORTED = 'imported', // Imported using private key
  WALLET_CONNECT = 'walletConnect',
  FIREBLOCKS = 'fireblocks',
}

export type ImportedAccountType = Exclude<AccountType, AccountType.PRIMARY>;

export enum ImportType {
  PRIVATE_KEY = 'privateKey',
  WALLET_CONNECT = 'walletConnect',
  FIREBLOCKS = 'fireblocks',
}
export const IMPORT_TYPE_TO_ACCOUNT_TYPE_MAP: Record<
  ImportType,
  ImportedAccountType
> = {
  [ImportType.PRIVATE_KEY]: AccountType.IMPORTED,
  [ImportType.WALLET_CONNECT]: AccountType.WALLET_CONNECT,
  [ImportType.FIREBLOCKS]: AccountType.FIREBLOCKS,
};

export type ImportData =
  | PrivateKeyImportData
  | WalletConnectImportData
  | FireblocksImportData;

export type FireblocksApiData = {
  vaultAccountId: string;
  key: string;
  secret: string;
};

export type FireblocksImportData = {
  importType: ImportType.FIREBLOCKS;
  data: {
    addresses: {
      addressC: string;
      addressBTC?: string;
    };
    api?: FireblocksApiData;
  };
};

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
  addressHVM?: string;
  addressSVM?: string;
  type?: AccountType;
}

export interface PrimaryAccount extends AccountStorageItem {
  index: number;
  type: AccountType.PRIMARY;
  addressBTC: string;
  walletId: string;
}

export type ImportedAccount =
  | ImportedPrivateKeyAccount
  | WalletConnectAccount
  | FireblocksAccount;
export interface ImportedPrivateKeyAccount extends AccountStorageItem {
  type: AccountType.IMPORTED;
  addressBTC: string;
}

export interface WalletConnectAccount extends AccountStorageItem {
  type: AccountType.WALLET_CONNECT;
}
export interface FireblocksAccount extends AccountStorageItem {
  type: AccountType.FIREBLOCKS;
}

export type Account = PrimaryAccount | ImportedAccount;

export type WalletId = string;
export interface Accounts {
  active?: Account;
  primary: Record<WalletId, PrimaryAccount[]>;
  imported: Record<
    string,
    ImportedAccount | WalletConnectAccount | FireblocksAccount
  >;
}

export const ACCOUNTS_STORAGE_KEY = 'accounts';

export enum AccountsEvents {
  ACCOUNTS_UPDATED = 'accounts-updated',
  ACTIVE_ACCOUNT_CHANGED = 'active-account-changed',
}

export enum GetPrivateKeyErrorTypes {
  Password = 'password',
  Type = 'type',
  Chain = 'chain',
  DerivePath = 'derivePath',
  Mnemonic = 'mnemonic',
}

export type GetAddressesInRangeResponse = {
  internal: string[];
  external: string[];
};

export type GetAddressesInRangeDisplayData = {
  indices: {
    externalStart: number;
    internalStart: number;
    externalLimit: number;
    internalLimit: number;
  };
  addresses: GetAddressesInRangeResponse;
};

export enum PrivateKeyChain {
  C = 'C',
  XP = 'XP',
}

export type AccountWithOptionalAddresses = PartialBy<
  Account,
  Extract<keyof Account, `address${string}`>
>;

export const IMPORTED_ACCOUNTS_WALLET_ID = '__IMPORTED__';
