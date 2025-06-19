import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useWalletContext } from '../contexts';
import { SecretType } from '@core/types';

export const useWalletName = () => {
  const { t } = useTranslation();
  const { walletDetails } = useWalletContext();

  const walletName = useMemo(() => {
    if (!walletDetails?.type) {
      return;
    }

    switch (walletDetails.type) {
      case SecretType.Mnemonic:
        return t('Recovery Phrase {{number}}', {
          number: '01',
        });

      case SecretType.Keystone:
      case SecretType.Keystone3Pro:
        return t('Keystone {{number}}', {
          number: '01',
        });

      case SecretType.Ledger:
      case SecretType.LedgerLive:
        return t('Ledger {{number}}', {
          number: '01',
        });

      case SecretType.Seedless:
        return t('Seedless {{number}}', {
          number: '01',
        });
    }
  }, [t, walletDetails?.type]);

  return walletName;
};
