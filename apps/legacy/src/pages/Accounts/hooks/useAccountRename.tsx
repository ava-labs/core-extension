import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { useScopedToast } from '@/hooks/useScopedToast';
import { useAccountsContext } from '@core/ui';
import { Account } from '@core/types';

import { useEntityRename } from './useEntityRename';

export const useAccountRename = (account?: Account) => {
  const { t } = useTranslation();
  const { renameAccount } = useAccountsContext();
  const toast = useScopedToast('account-switcher');

  const onFailure = useCallback(
    () => toast.success(t('Renaming failed'), { duration: 1000 }),
    [toast, t],
  );
  const onSuccess = useCallback(
    () => toast.success(t('Account renamed'), { duration: 1000 }),
    [toast, t],
  );
  const updateFn = useCallback(
    (newName: string) =>
      account?.id ? renameAccount(account.id, newName.trim()) : undefined,
    [renameAccount, account?.id],
  );

  return useEntityRename({
    currentName: account?.name ?? '',
    dialogTitle: t('Rename Account'),
    updateFn,
    onFailure,
    onSuccess,
  });
};
