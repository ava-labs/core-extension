import { SignerSessionData } from '@cubist-labs/cubesigner-sdk';
import { DerivationPath } from '@avalabs/core-wallets-sdk';
import { NetworkVMType } from '@avalabs/vm-module-types';

import {
  FireblocksApiData,
  ImportedAccount,
  PrimaryAccount,
  WalletConnectAddresses,
} from './account';
import {
  BtcWalletPolicyDetails,
  PubKeyType,
  SeedlessAuthProvider,
} from './wallet';

export enum SecretType {
  // Primary wallet types
  Mnemonic = 'mnemonic',
  Ledger = 'ledger',
  LedgerLive = 'ledger-live',
  Keystone = 'keystone',
  Keystone3Pro = 'keystone3-pro',
  Seedless = 'seedless',
  // Importable wallets types
  PrivateKey = 'private-key',
  WalletConnect = 'wallet-connect',
  Fireblocks = 'fireblocks',
}

export type Secp256k1 = 'secp256k1';
export type Ed25519 = 'ed25519';
export type Curve = Secp256k1 | Ed25519;
export const EVM_BASE_DERIVATION_PATH = "m/44'/60'/0'";
export const AVALANCHE_BASE_DERIVATION_PATH = "m/44'/9000'/0'";

export type AddressPublicKeyJson<HasDerivationPath extends boolean = true> = {
  type: 'address-pubkey';
  curve: Curve;
  derivationPath: HasDerivationPath extends true ? string : null;
  key: string;
  btcWalletPolicyDetails?: BtcWalletPolicyDetails;
};

export type ExtendedPublicKey = {
  type: 'extended-pubkey';
  curve: Secp256k1;
  derivationPath: string;
  key: string;
  btcWalletPolicyDetails?: BtcWalletPolicyDetails;
};

interface SecretsBase {
  secretType: SecretType;
}

interface PrimarySecretsBase extends SecretsBase {
  id: string;
  name: string;
  publicKeys: AddressPublicKeyJson[];
}

export interface SeedlessSecrets extends PrimarySecretsBase {
  secretType: SecretType.Seedless;
  derivationPathSpec: DerivationPath.BIP44;
  seedlessSignerToken: SignerSessionData;
  authProvider: SeedlessAuthProvider;
  userEmail?: string;
  userId?: string;
}

export interface MnemonicSecrets extends PrimarySecretsBase {
  secretType: SecretType.Mnemonic;
  mnemonic: string;
  extendedPublicKeys: ExtendedPublicKey[];
  derivationPathSpec: DerivationPath.BIP44;
}

export const isKeystoneSecrets = (
  secrets: PrimaryWalletSecrets,
): secrets is KeystoneSecrets => {
  return (
    secrets.secretType === SecretType.Keystone ||
    secrets.secretType === SecretType.Keystone3Pro
  );
};

export interface KeystoneSecrets extends PrimarySecretsBase {
  secretType: SecretType.Keystone | SecretType.Keystone3Pro;
  masterFingerprint: string;
  extendedPublicKeys: ExtendedPublicKey[];
  derivationPathSpec: DerivationPath.BIP44;
}

export interface LedgerSecrets extends PrimarySecretsBase {
  secretType: SecretType.Ledger;
  extendedPublicKeys: ExtendedPublicKey[];
  derivationPathSpec: DerivationPath.BIP44;
}

export interface LedgerLiveSecrets extends PrimarySecretsBase {
  secretType: SecretType.LedgerLive;
  extendedPublicKeys: ExtendedPublicKey[];
  derivationPathSpec: DerivationPath.LedgerLive;
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

export type AccountWithSeedlessSecrets = Extract<
  AccountWithSecrets,
  { secretType: SecretType.Seedless }
>;

export type PrimaryAccountWithSecrets = {
  account: PrimaryAccount;
} & PrimaryWalletSecrets;

export type ImportedAccountWithSecrets = {
  account: ImportedAccount;
} & ImportedAccountSecrets;

export type AccountWithSecrets =
  | PrimaryAccountWithSecrets
  | ImportedAccountWithSecrets;

export type DerivedAddresses = {
  addressC: string;
  addressBTC?: string;
  addressAVM?: string;
  addressPVM?: string;
  addressCoreEth?: string;
  addressHVM?: string;
  addressSVM?: string;
};

export type DerivationPathsMap = Record<
  Exclude<NetworkVMType, NetworkVMType.PVM | NetworkVMType.CoreEth>,
  string
>;

export type IsKnownSecretResult =
  | {
      isKnown: true;
      name: string;
    }
  | {
      isKnown: false;
    };
