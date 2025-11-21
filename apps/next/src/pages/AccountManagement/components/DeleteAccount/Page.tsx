import { toast } from '@avalabs/k2-alpine';
import { useAccountManager, useAccountsContext } from '@core/ui';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect, useHistory, useLocation } from 'react-router-dom';
import { Page } from '@/components/Page';
import { useAccountSearchParams } from '../../hooks/useAccountSearchParams';
import { URL_SEARCH_TOKENS } from '../../utils/searchParams';
import { DeleteAccountForm } from './Form';

export const DeleteAccount: FC = () => {
  const { t } = useTranslation();
  const params = useAccountSearchParams(true);
  const { deleteAccounts } = useAccountsContext();
  const { exitManageMode } = useAccountManager();
  const { goBack, go } = useHistory();
  const { search } = useLocation();

  if (!params.success) {
    return <Redirect to="/account-management" />;
  }

  const { accounts } = params;

  const [singleAccount] = accounts;
  const searchParams = new URLSearchParams(search);
  const bulkModeParam = searchParams.get(URL_SEARCH_TOKENS.bulkMode);
  const isBulk = bulkModeParam === 'true' || accounts.length > 1;
  const areMultipleAccounts = isBulk && accounts.length > 1;
  const onDone = () => (isBulk ? goBack() : go(-2));

  return (
    <Page
      withBackButton
      contentProps={{ alignItems: 'stretch', justifyContent: 'flex-start' }}
    >
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
        onDelete={() =>
          deleteAccounts(accounts.map((account) => account.id))
            .then(() => {
              toast.success(
                isBulk ? t('Accounts deleted') : t('Account deleted'),
              );
              onDone();
            })
            .catch(() => {
              toast.error(t('Failed to delete account. Try again.'));
            })
            .finally(() => {
              exitManageMode();
            })
        }
        onCancel={goBack}
      />
    </Page>
  );
};
