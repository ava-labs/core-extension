import { toast } from '@avalabs/k2-alpine';
import { useAccountsContext } from '@core/ui';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect, useHistory } from 'react-router-dom';
import { useAccountSearchParams } from '../../hooks/useAccountSearchParams';
import { DeleteAccountForm } from './Form';

export const DeleteAccount: FC = () => {
  const { t } = useTranslation();
  const params = useAccountSearchParams(true);
  const { deleteAccounts } = useAccountsContext();
  const { replace, goBack } = useHistory();

  if (!params.success) {
    return <Redirect to="/account-management" />;
  }

  const { accounts } = params;

  const isBulk = accounts.length > 1;
  const [singleAccount] = accounts;

  return (
    <DeleteAccountForm
      label={
        isBulk
          ? t('Are you sure you want to delete selected accounts?')
          : t('Are you sure you want to delete {{name}} account?', {
              name: singleAccount.name,
            })
      }
      message={
        isBulk
          ? t('Deleting these accounts is permanent and cannot be undone')
          : t('Deleting this account is permanent and cannot be undone')
      }
      onDelete={() =>
        deleteAccounts(accounts.map((account) => account.id))
          .then(() => {
            replace('/account-management');
            toast.success(
              isBulk ? t('Accounts deleted') : t('Account deleted'),
            );
          })
          .catch(() => {
            toast.error(t('Failed to delete account. Try again.'));
          })
      }
      onCancel={goBack}
    />
  );
};
