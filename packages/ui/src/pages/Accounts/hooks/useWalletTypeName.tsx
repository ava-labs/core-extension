import { Account, AccountType, SecretType, WalletDetails } from '@core/types';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

export const useWalletTypeName = (
  walletDetails?: WalletDetails,
  account?: Account,
) => {
  const { t } = useTranslation();

  const getWalletType = useCallback(() => {
    switch (walletDetails?.type) {
      case SecretType.Ledger:
      case SecretType.LedgerLive:
        return t('Ledger');

      case SecretType.Mnemonic:
        return t('Recovery Phrase');

      case SecretType.PrivateKey:
        return t('Imported Private Key');

      case SecretType.Fireblocks:
        return t('Fireblocks');

      case SecretType.WalletConnect:
        return t('WalletConnect');

      case SecretType.Keystone:
        return t('Keystone');

      case SecretType.Seedless:
        return walletDetails.authProvider
          ? t('Seedless ({{provider}})', {
              provider: walletDetails.authProvider,
            })
          : t('Seedless');
    }

    switch (account?.type) {
      case AccountType.IMPORTED:
        return t('Imported Private Key');

      case AccountType.FIREBLOCKS:
        return t('Fireblocks');

      case AccountType.WALLET_CONNECT:
        return t('WalletConnect');
    }

    return t('Unknown');
  }, [account?.type, t, walletDetails?.type, walletDetails?.authProvider]);

  return getWalletType;
};
