import { toast } from '@avalabs/k2-alpine';
import {
  useAccountManager,
  useAccountsContext,
  useAnalyticsContext,
} from '@core/ui';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect, useHistory } from 'react-router-dom';
import { IMPORTED_ACCOUNTS_WALLET_ID } from '@core/types';
import { useAccountSearchParams } from '../../hooks/useAccountSearchParams';
import { AccountManagementRouteState } from '../../types';
import { DeleteAccountForm } from './Form';

export const DeleteAccount: FC = () => {
  const { t } = useTranslation();
  const params = useAccountSearchParams(true);
  const { deleteAccounts } = useAccountsContext();
  const { exitManageMode } = useAccountManager();
  const {
    goBack,
    go,
    location: { state },
  } = useHistory<AccountManagementRouteState>();
  const { capture } = useAnalyticsContext();

  if (!params.success) {
    return <Redirect to="/account-management" />;
  }

  const { accounts } = params;

  const [singleAccount] = accounts;
  const isBulk = state?.bulkMode ?? accounts.length > 1;
  const areMultipleAccounts = isBulk && accounts.length > 1;
  const onDone = () => (isBulk ? goBack() : go(-2));

  return (
    <DeleteAccountForm
      label={
        areMultipleAccounts
          ? t('Are you sure you want to delete selected accounts?')
          : t('Are you sure you want to delete {{name}} account?', {
              name: singleAccount.name,
            })
      }
      message={
        areMultipleAccounts
          ? t('Deleting these accounts is permanent and cannot be undone')
          : t('Deleting this account is permanent and cannot be undone')
      }
      onDelete={() => {
        const isImportedAccount = accounts.some(
          (account: any) =>
            'walletId' in account &&
            account.walletId === IMPORTED_ACCOUNTS_WALLET_ID,
        );
        if (isImportedAccount) {
          capture('ImportedAccountDeleteClicked');
        }
        deleteAccounts(accounts.map((account) => account.id))
          .then(() => {
            toast.success(
              isBulk ? t('Accounts deleted') : t('Account deleted'),
            );
            capture('AccountDeleteSucceeded');
            onDone();
          })
          .catch(() => {
            toast.error(t('Failed to delete account. Try again.'));
            capture('AccountDeleteFailed');
          })
          .finally(() => {
            exitManageMode();
          });
      }}
      onCancel={goBack}
    />
  );
};
