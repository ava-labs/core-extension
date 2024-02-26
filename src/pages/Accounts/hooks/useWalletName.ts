import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useWalletContext } from '@src/contexts/WalletProvider';
import { SecretType } from '@src/background/services/secrets/models';

export const useWalletName = () => {
  const { t } = useTranslation();
  const { walletDetails } = useWalletContext();

  const walletName = useMemo(() => {
    if (!walletDetails?.type) {
      return;
    }

    switch (walletDetails.type) {
      case SecretType.Mnemonic:
        return t('Seed Phrase {{number}}', {
          number: '01',
        });

      case SecretType.Keystone:
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
