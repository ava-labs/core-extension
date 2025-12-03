type ExtendedPublicKey = {
  type: 'extended-pubkey';
  curve: 'secp256k1';
  derivationPath: string;
  key: string;
  btcWalletPolicyDetails?: unknown;
};

type LegacyLedgerLiveSecrets = {
  secretType: 'ledger-live';
  derivationPathSpec: 'ledger_live';
  [key: string]: unknown;
};

export type NewLedgerLiveSecrets = Omit<
  LegacyLedgerLiveSecrets,
  'extendedPublicKeys'
> & {
  extendedPublicKeys: ExtendedPublicKey[];
};

interface OtherSecrets {
  secretType: 'ledger' | 'keystone' | 'seedless' | 'mnemonic';
  // Rest is irrelevant, we do not touch non-LedgerLive wallets here
  [key: string]: unknown;
}
export type LegacySchema = {
  wallets: Array<LegacyLedgerLiveSecrets | OtherSecrets>;
  importedAccounts: Record<string, unknown>;
  version: 6;
};

export type NewSchema = {
  wallets: Array<NewLedgerLiveSecrets | OtherSecrets>;
  importedAccounts: Record<string, unknown>;
  version: 7;
};
