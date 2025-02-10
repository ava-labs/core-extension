import {
  BtcWalletPolicyDetails,
  ImportedFireblocksSecrets,
  ImportedPrivateKeySecrets,
  ImportedWalletConnectSecrets,
  PubKeyType,
} from './commonModels';

export type SeedlessSecrets = {
  id: string;
  name: string;
  secretType: 'seedless';
  pubKeys: PubKeyType[];
  derivationPath: 'bip44';
  seedlessSignerToken?: any; // external type
  authProvider: 'google' | 'apple';
  userEmail?: string;
  userId?: string;
};

export type MnemonicSecrets = {
  id: string;
  name: string;
  secretType: 'mnemonic';
  mnemonic: string;
  xpub: string;
  xpubXP: string;
  derivationPath: 'bip44';
};

export type KeystoneSecrets = {
  id: string;
  name: string;
  secretType: 'keystone';
  masterFingerprint: string;
  xpub: string;
  derivationPath: 'bip44';
};

export type LedgerSecrets = {
  id: string;
  name: string;
  secretType: 'ledger';
  xpub: string;
  xpubXP?: string;
  derivationPath: 'bip44';
  btcWalletPolicyDetails?: BtcWalletPolicyDetails;
};

export type LedgerLiveSecrets = {
  id: string;
  name: string;
  secretType: 'ledger-live';
  pubKeys: PubKeyType[];
  derivationPath: 'ledger_live';
};

export type LegacySchema = {
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
  version: 4;
};
