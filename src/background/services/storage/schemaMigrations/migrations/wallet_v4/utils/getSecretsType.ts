import { SecretType } from '@src/background/services/secrets/models';

export type WalletKeys = {
  mnemonic?: string;
  masterFingerprint?: string;
  pubKeys?: {
    evm: string;
    /**
     * Public keys used for X/P chain are from a different derivation path.
     */
    xp?: string;
    btcWalletPolicyDetails?: {
      hmacHex: string;
      /**
       * Extended public key of m/44'/60'/n
       */
      xpub: string;
      masterFingerprint: string;
      name: string;
    };
  }[];
  xpub?: string;
  xpubXP?: string;
  seedlessSignerToken?: unknown;
};

export function getSecretsType(walletKeys: WalletKeys) {
  const {
    mnemonic,
    masterFingerprint,
    pubKeys,
    xpub,
    xpubXP,
    seedlessSignerToken,
  } = walletKeys;

  if (seedlessSignerToken) {
    return SecretType.Seedless;
  }

  if (mnemonic && xpub && xpubXP) {
    return SecretType.Mnemonic;
  }

  if (masterFingerprint && xpub) {
    return SecretType.Keystone;
  }

  if (xpub) {
    return SecretType.Ledger;
  }

  if (pubKeys) {
    return SecretType.LedgerLive;
  }

  throw new Error('Cannot get the secret type for a primary account');
}
