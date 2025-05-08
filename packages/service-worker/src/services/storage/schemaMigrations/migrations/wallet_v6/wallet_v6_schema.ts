export type AddressPublicKeyType = {
  type: 'address-pubkey';
  curve: 'secp256k1' | 'ed25519';
  derivationPath: string;
  key: string;
  btcWalletPolicyDetails?: unknown;
};
export type DerivationPathSpec = 'bip44' | 'ledger_live';

interface MnemonicSecrets {
  secretType: 'mnemonic';
  mnemonic: string;
  derivationPathSpec: DerivationPathSpec;
  publicKeys: AddressPublicKeyType[];
  [key: string]: unknown;
}
interface OtherSecrets {
  secretType: 'ledger' | 'ledger-live' | 'keystone' | 'seedless';
  // Rest is irrelevant, we do not touch non-mnemonic wallets here
  [key: string]: unknown;
}
export type Schema = {
  wallets: Array<MnemonicSecrets | OtherSecrets>;
  importedAccounts: Record<string, unknown>;
  version: 5;
};
