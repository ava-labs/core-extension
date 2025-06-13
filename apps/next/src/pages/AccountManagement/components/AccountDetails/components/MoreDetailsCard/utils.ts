import { SecretType } from '@core/types';
import { TFunction } from 'i18next';

export function getSecretTypeDisplayName(type: SecretType, t: TFunction) {
  if (
    type === SecretType.PrivateKey ||
    type === SecretType.WalletConnect ||
    type === SecretType.Fireblocks
  ) {
    return t('Imported');
  }

  if (type === SecretType.Ledger || type === SecretType.LedgerLive) {
    return 'Ledger';
  }

  if (type === SecretType.Mnemonic) {
    return t('Recovery Phrase');
  }

  if (type === SecretType.Keystone) {
    return 'Keystone';
  }

  if (type === SecretType.Seedless) {
    return t('Seedless');
  }

  return t('Unknown');
}
