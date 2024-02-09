import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { WalletType } from '@src/background/services/wallet/models';
import { useWalletContext } from '@src/contexts/WalletProvider';

export const useWalletName = () => {
  const { t } = useTranslation();
  const { walletDetails } = useWalletContext();

  const walletName = useMemo(() => {
    if (!walletDetails?.type) {
      return;
    }

    switch (walletDetails.type) {
      case WalletType.MNEMONIC:
        return t('Seed Phrase {{number}}', {
          number: '01',
        });

      case WalletType.KEYSTONE:
        return t('Keystone {{number}}', {
          number: '01',
        });

      case WalletType.LEDGER:
        return t('Ledger {{number}}', {
          number: '01',
        });

      case WalletType.SEEDLESS:
        return t('Seedless {{number}}', {
          number: '01',
        });
    }
  }, [t, walletDetails?.type]);

  return walletName;
};
