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
import { DerivationPath } from '@avalabs/core-wallets-sdk';
import { NetworkVMType } from '@avalabs/vm-module-types';

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
}

export interface SeedlessSecrets extends PrimarySecretsBase {
  secretType: SecretType.Seedless;
  publicKeys: AddressPublicKeyJson[];
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
  publicKeys: AddressPublicKeyJson[];
  derivationPathSpec: DerivationPath.BIP44;
}

export interface KeystoneSecrets extends PrimarySecretsBase {
  secretType: SecretType.Keystone;
  masterFingerprint: string;
  publicKeys: AddressPublicKeyJson[];
  extendedPublicKeys: ExtendedPublicKey[];
  derivationPathSpec: DerivationPath.BIP44;
}

export interface LedgerSecrets extends PrimarySecretsBase {
  secretType: SecretType.Ledger;
  publicKeys: AddressPublicKeyJson[];
  extendedPublicKeys: ExtendedPublicKey[];
  derivationPathSpec: DerivationPath.BIP44;
}

export interface LedgerLiveSecrets extends PrimarySecretsBase {
  secretType: SecretType.LedgerLive;
  publicKeys: AddressPublicKeyJson[];
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

export type DerivationPathsMap = Record<
  Exclude<NetworkVMType, NetworkVMType.PVM | NetworkVMType.CoreEth>,
  string
>;
