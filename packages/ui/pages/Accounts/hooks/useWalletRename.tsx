import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { useScopedToast } from '@src/hooks/useScopedToast';
import { useWalletContext } from '@src/contexts/WalletProvider';
import { WalletDetails } from '@core/service-worker';

import { useEntityRename } from './useEntityRename';

export const useWalletRename = (wallet?: WalletDetails) => {
  const { t } = useTranslation();
  const { renameWallet } = useWalletContext();
  const toast = useScopedToast('account-switcher');

  const onFailure = useCallback(
    () => toast.success(t('Renaming failed'), { duration: 1000 }),
    [toast, t],
  );
  const onSuccess = useCallback(
    () => toast.success(t('Wallet renamed'), { duration: 1000 }),
    [toast, t],
  );
  const updateFn = useCallback(
    (newName: string) => {
      if (!wallet?.id) {
        toast.error(t('This wallet cannot be renamed'), { duration: 1000 });
        return;
      }

      return renameWallet(wallet.id, newName.trim());
    },
    [renameWallet, wallet?.id, t, toast],
  );

  return useEntityRename({
    currentName: wallet?.name ?? '',
    dialogTitle: t('Rename Wallet'),
    updateFn,
    onFailure,
    onSuccess,
  });
};
