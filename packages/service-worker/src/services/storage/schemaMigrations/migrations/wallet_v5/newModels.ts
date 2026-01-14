import {
  BtcWalletPolicyDetails,
  ImportedFireblocksSecrets,
  ImportedPrivateKeySecrets,
  ImportedWalletConnectSecrets,
} from './commonModels';

export type AddressPublicKey = {
  type: 'address-pubkey';
  curve: 'secp256k1' | 'ed25519';
  derivationPath: string;
  key: string;
  btcWalletPolicyDetails?: BtcWalletPolicyDetails;
};

export type ExtendedPublicKey = {
  type: 'extended-pubkey';
  curve: 'secp256k1';
  derivationPath: string;
  key: string;
  btcWalletPolicyDetails?: BtcWalletPolicyDetails;
};

export type SeedlessSecrets = {
  id: string;
  name: string;
  secretType: 'seedless';
  publicKeys: AddressPublicKey[];
  derivationPathSpec: 'bip44';
  seedlessSignerToken: any; // external type
  authProvider: 'google' | 'apple';
  userEmail?: string;
  userId?: string;
};

export type MnemonicSecrets = {
  id: string;
  name: string;
  secretType: 'mnemonic';
  mnemonic: string;
  extendedPublicKeys: ExtendedPublicKey[];
  publicKeys: AddressPublicKey[];
  derivationPathSpec: 'bip44';
};

export type KeystoneSecrets = {
  id: string;
  name: string;
  secretType: 'keystone';
  masterFingerprint: string;
  publicKeys: AddressPublicKey[];
  extendedPublicKeys: ExtendedPublicKey[];
  derivationPathSpec: 'bip44';
};

export type LedgerSecrets = {
  id: string;
  name: string;
  secretType: 'ledger';
  publicKeys: AddressPublicKey[];
  extendedPublicKeys: ExtendedPublicKey[];
  derivationPathSpec: 'bip44';
};

export type LedgerLiveSecrets = {
  id: string;
  name: string;
  secretType: 'ledger-live';
  publicKeys: AddressPublicKey[];
  derivationPathSpec: 'ledger_live';
};

export type NewSchema = {
  wallets: Array<
    | KeystoneSecrets
    | LedgerLiveSecrets
    | LedgerSecrets
    | MnemonicSecrets
    | SeedlessSecrets
  >;
  importedAccounts: Record<
    string,
    | ImportedPrivateKeySecrets
    | ImportedWalletConnectSecrets
    | ImportedFireblocksSecrets
  >;
  version: 5;
};
