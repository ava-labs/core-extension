import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { useScopedToast } from '@core/ui';
import { useAccountsContext } from '@core/ui';

import { ConfirmAccountRemovalDialog } from '../components/ConfirmAccountRemovalDialog';
import { useAnalyticsContext } from '@core/ui';
import { useAccountManager } from '@core/ui';

export const useAccountRemoval = (accountIds: string[]) => {
  const [isPrompted, setIsPrompted] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { t } = useTranslation();
  const { exitManageMode } = useAccountManager();
  const { deleteAccounts } = useAccountsContext();
  const { capture } = useAnalyticsContext();
  const toast = useScopedToast('account-switcher');
  const history = useHistory();

  const confirm = useCallback(async () => {
    setIsDeleting(true);
    deleteAccounts(accountIds)
      .then(() => {
        capture('AccountDeleteSucceeded');
        setIsPrompted(false);
        exitManageMode();
        history.replace('/accounts');
        toast.success(
          t('Successfully deleted {{number}} account(s)', {
            number: accountIds.length,
          }),
        );
      })
      .catch(() => {
        toast.error(t('Account(s) removal has failed!'), { duration: 2000 });
        capture('AccountDeleteFailed');
      })
      .finally(() => {
        setIsDeleting(false);
      });
  }, [accountIds, capture, deleteAccounts, exitManageMode, history, t, toast]);

  const prompt = useCallback(() => setIsPrompted(true), []);
  const cancel = useCallback(() => setIsPrompted(false), []);

  const renderDialog = useCallback(
    () => (
      <ConfirmAccountRemovalDialog
        isDeleting={isDeleting}
        open={isPrompted}
        isMultiple={accountIds.length > 1}
        onConfirm={confirm}
        onClose={cancel}
      />
    ),
    [isDeleting, isPrompted, accountIds, cancel, confirm],
  );

  return {
    prompt,
    renderDialog,
  };
};
