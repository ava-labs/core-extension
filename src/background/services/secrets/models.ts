import { DerivationPath } from '@avalabs/core-wallets-sdk';
import { SignerSessionData } from '@cubist-labs/cubesigner-sdk';

import {
  FireblocksApiData,
  ImportedAccount,
  PrimaryAccount,
  WalletConnectAddresses,
} from '../accounts/models';
import {
  BtcWalletPolicyDetails,
  PubKeyType,
  SeedlessAuthProvider,
} from '../wallet/models';

export enum SecretType {
  // Primary wallet types
  Mnemonic = 'mnemonic',
  Ledger = 'ledger',
  LedgerLive = 'ledger-live',
  Keystone = 'keystone',
  Seedless = 'seedless',
  // Importable wallets types
  PrivateKey = 'private-key',
  WalletConnect = 'wallet-connect',
  Fireblocks = 'fireblocks',
}

interface SecretsBase {
  secretType: SecretType;
}

interface PrimarySecretsBase extends SecretsBase {
  id: string;
  name: string;
}

interface SeedlessSecrets extends PrimarySecretsBase {
  secretType: SecretType.Seedless;
  pubKeys: PubKeyType[];
  seedlessSignerToken: SignerSessionData;
  derivationPath: DerivationPath;
  authProvider: SeedlessAuthProvider;
  userEmail?: string;
  userId?: string;
  mnemonic?: never;
  xpub?: never;
  xpubXP?: never;
}

interface MnemonicSecrets extends PrimarySecretsBase {
  secretType: SecretType.Mnemonic;
  mnemonic: string;
  xpub: string;
  xpubXP: string;
  derivationPath: DerivationPath;
}

interface KeystoneSecrets extends PrimarySecretsBase {
  secretType: SecretType.Keystone;
  masterFingerprint: string;
  xpub: string;
  xpubXP?: never;
  derivationPath: DerivationPath;
}

interface LedgerSecrets extends PrimarySecretsBase {
  secretType: SecretType.Ledger;
  xpub: string;
  xpubXP?: string;
  derivationPath: DerivationPath.BIP44;
  btcWalletPolicyDetails?: BtcWalletPolicyDetails;
}

interface LedgerLiveSecrets extends PrimarySecretsBase {
  secretType: SecretType.LedgerLive;
  pubKeys: PubKeyType[];
  xpubXP?: never;
  derivationPath: DerivationPath.LedgerLive;
}

interface ImportedPrivateKeySecrets extends SecretsBase {
  secretType: SecretType.PrivateKey;
  secret: string;
}

interface ImportedWalletConnectSecrets extends SecretsBase {
  secretType: SecretType.WalletConnect;
  addresses: WalletConnectAddresses;
  pubKey?: PubKeyType;
}

interface ImportedFireblocksSecrets extends SecretsBase {
  secretType: SecretType.Fireblocks;
  addresses: {
    addressC: string;
    addressBTC?: string;
  };
  api?: FireblocksApiData;
}

export type PrimaryWalletSecrets =
  | MnemonicSecrets
  | KeystoneSecrets
  | LedgerSecrets
  | LedgerLiveSecrets
  | SeedlessSecrets;

export type ImportedAccountSecrets =
  | ImportedPrivateKeySecrets
  | ImportedWalletConnectSecrets
  | ImportedFireblocksSecrets;

export type AccountWithSecrets =
  | ({
      account?: PrimaryAccount;
    } & PrimaryWalletSecrets)
  | ({ account: ImportedAccount } & ImportedAccountSecrets);

export type DerivedAddresses = {
  addressC: string;
  addressBTC?: string;
  addressAVM?: string;
  addressPVM?: string;
  addressCoreEth?: string;
  addressHVM?: string;
};
