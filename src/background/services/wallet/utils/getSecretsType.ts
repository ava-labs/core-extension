import { SecretType } from '../../secrets/models';
import { WalletKeys } from '../models';

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
