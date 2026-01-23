import { AddressIndex } from '@avalabs/types';
import { NetworkVMType, PartialBy } from '@avalabs/vm-module-types';

import { PubKeyType } from './wallet';
import { EnsureDefined } from './util-types';

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
  imported: Record<string, ImportedAccount>;
}

export const ACCOUNTS_STORAGE_KEY = 'accounts';

export enum AccountsEvents {
  ACCOUNTS_UPDATED = 'accounts-updated',
  ACTIVE_ACCOUNT_CHANGED = 'active-account-changed',
  ACCOUNTS_DELETED = 'accounts-deleted',
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

/**
 * Generic utility type that extracts only properties starting with "address" from a given type
 */
export type AddressProperties<T> = {
  [K in keyof T as K extends `address${string}` ? K : never]: T[K];
};

/**
 * Generic utility type that overrides all property values to undefined
 */
export type MakeUndefined<T> = {
  [K in keyof T]: undefined;
};

/**
 * Type representing only the address properties from the Account type
 */
export type AccountAddresses = AddressProperties<Account>;

export const IMPORTED_ACCOUNTS_WALLET_ID = '__IMPORTED__';

export type AvmCapableAccount = EnsureDefined<
  Account,
  'addressAVM' | 'addressCoreEth'
>;

export const isAvmCapableAccount = (
  account?: Account,
): account is AvmCapableAccount =>
  Boolean(account && account.addressAVM && account.addressCoreEth);

export type PvmCapableAccount = EnsureDefined<
  Account,
  'addressPVM' | 'addressCoreEth'
>;

export type SvmCapableAccount = EnsureDefined<Account, 'addressSVM'>;

export type BtcCapableAccount = EnsureDefined<Account, 'addressBTC'>;

export type EvmCapableAccount = EnsureDefined<Account, 'addressC'>;

export type HvmCapableAccount = EnsureDefined<Account, 'addressHVM'>;

export type CoreEthCapableAccount = EnsureDefined<Account, 'addressCoreEth'>;

// Type mapping for VM types to their corresponding account types
type VMAccountTypeMap = {
  [NetworkVMType.EVM]: EvmCapableAccount;
  [NetworkVMType.SVM]: SvmCapableAccount;
  [NetworkVMType.AVM]: AvmCapableAccount;
  [NetworkVMType.PVM]: PvmCapableAccount;
  [NetworkVMType.HVM]: HvmCapableAccount;
  [NetworkVMType.BITCOIN]: BtcCapableAccount;
  [NetworkVMType.CoreEth]: CoreEthCapableAccount;
};

export const isPvmCapableAccount = (
  account?: Account,
): account is PvmCapableAccount =>
  Boolean(account && account.addressPVM && account.addressCoreEth);

export const isSvmCapableAccount = (
  account?: Account,
): account is SvmCapableAccount => Boolean(account && account.addressSVM);

export const isBtcCapableAccount = (
  account?: Account,
): account is BtcCapableAccount => Boolean(account && account.addressBTC);

export const isHvmCapableAccount = (
  account?: Account,
): account is HvmCapableAccount => Boolean(account && account.addressHVM);

export const isCoreEthCapableAccount = (
  account?: Account,
): account is CoreEthCapableAccount =>
  Boolean(account && account.addressCoreEth);

export const isVMCapableAccount = <V extends NetworkVMType>(
  vm: V,
  account?: Account,
): account is VMAccountTypeMap[V] => {
  switch (vm) {
    case NetworkVMType.AVM:
      return isAvmCapableAccount(account);
    case NetworkVMType.PVM:
      return isPvmCapableAccount(account);
    case NetworkVMType.SVM:
      return isSvmCapableAccount(account);
    case NetworkVMType.BITCOIN:
      return isBtcCapableAccount(account);
    case NetworkVMType.HVM:
      return isHvmCapableAccount(account);
    case NetworkVMType.CoreEth:
      return isCoreEthCapableAccount(account);
    default:
      return true;
  }
};

export type XPAddresses = {
  externalAddresses: AddressIndex[];
  internalAddresses: AddressIndex[];
};
