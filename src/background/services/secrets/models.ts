import { DerivationPath } from '@avalabs/wallets-sdk';

import {
  FireblocksApiData,
  ImportedAccount,
  PrimaryAccount,
  WalletConnectAddresses,
} from '../accounts/models';
import { BtcWalletPolicyDetails, PubKeyType } from '../wallet/models';

export enum SecretType {
  Mnemonic = 'mnemonic',
  Ledger = 'ledger',
  LedgerLive = 'ledger-live',
  Keystone = 'keystone',
  PrivateKey = 'private-key',
  WalletConnect = 'wallet-connect',
  Fireblocks = 'fireblocks',
}

interface SecretsBase {
  type: SecretType;
}

interface MnemonicSecrets extends SecretsBase {
  type: SecretType.Mnemonic;
  mnemonic: string;
  xpub: string;
  xpubXP: string;
  derivationPath: DerivationPath;
}

interface KeystoneSecrets extends SecretsBase {
  type: SecretType.Keystone;
  masterFingerprint: string;
  xpub: string;
  xpubXP?: never;
  derivationPath: DerivationPath;
}

interface LedgerSecrets extends SecretsBase {
  type: SecretType.Ledger;
  xpub: string;
  xpubXP?: string;
  derivationPath: DerivationPath.BIP44;
  btcWalletPolicyDetails?: BtcWalletPolicyDetails;
}

interface LedgerLiveSecrets extends SecretsBase {
  type: SecretType.LedgerLive;
  pubKeys: PubKeyType[];
  xpubXP?: never;
  derivationPath: DerivationPath.LedgerLive;
}

interface ImportedPrivateKeySecrets extends SecretsBase {
  type: SecretType.PrivateKey;
  secret: string;
}

interface ImportedWalletConnectSecrets extends SecretsBase {
  type: SecretType.WalletConnect;
  addresses: WalletConnectAddresses;
  pubKey?: PubKeyType;
}

interface ImportedFireblocksSecrets extends SecretsBase {
  type: SecretType.Fireblocks;
  addresses: {
    addressC: string;
    addressBTC?: string;
  };
  api?: FireblocksApiData;
}

export type PrimaryAccountSecrets =
  | MnemonicSecrets
  | KeystoneSecrets
  | LedgerSecrets
  | LedgerLiveSecrets;

export type ImportedAccountSecrets =
  | ImportedPrivateKeySecrets
  | ImportedWalletConnectSecrets
  | ImportedFireblocksSecrets;

export type AccountWithSecrets =
  | ({
      account?: PrimaryAccount;
    } & PrimaryAccountSecrets)
  | ({ account: ImportedAccount } & ImportedAccountSecrets);

export type DerivedAddresses = {
  addressC: string;
  addressBTC?: string;
  addressAVM?: string;
  addressPVM?: string;
  addressCoreEth?: string;
};
