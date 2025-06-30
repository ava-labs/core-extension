import { toast, ToastOptions } from '@avalabs/k2-alpine';
import { useAccountsContext } from '@core/ui';
import { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect, useHistory } from 'react-router-dom';
import { PageContent } from './components/PageContent';
import { RemoveAccount } from './components/RemoveAccount';
import { RenameAccount } from './components/RenameAccount';
import { ViewHost } from './components/ViewHost';

const toastOptions: ToastOptions = {
  id: 'account-details-guard',
};

export const AccountDetails: FC = () => {
  const { t } = useTranslation();
  const {
    location: { search },
    replace,
  } = useHistory();
  const searchParams = new URLSearchParams(search);
  const accountId = searchParams.get('accountId');
  const { getAccountById, renameAccount, deleteAccounts } =
    useAccountsContext();

  const [view, setView] = useState<'details' | 'rename' | 'remove'>('details');
  const switchTo = useMemo<Record<typeof view, () => void>>(
    () => ({
      details: () => setView('details'),
      rename: () => setView('rename'),
      remove: () => setView('remove'),
    }),
    [setView],
  );

  if (!accountId) {
    toast.error(t('Account Id is not provided'), toastOptions);
    return <Redirect to="/account-management" />;
  }

  const account = getAccountById(accountId);

  if (!account) {
    toast.error(t('Account not found'), toastOptions);
    return <Redirect to="/account-management" />;
  }

  return (
    <>
      <ViewHost in={view === 'details'}>
        <PageContent
          account={account}
          onRename={switchTo.rename}
          onRemove={switchTo.remove}
        />
      </ViewHost>
      <ViewHost in={view === 'rename'}>
        <RenameAccount
          account={account}
          onCancel={switchTo.details}
          onSave={(newName) => {
            renameAccount(account.id, newName)
              .then(() => {
                setView('details');
                toast.success(t('Account renamed'));
              })
              .catch(() => {
                toast.error(t('Failed to rename account. Try again.'));
              });
          }}
        />
      </ViewHost>
      <ViewHost in={view === 'remove'}>
        <RemoveAccount
          account={account}
          onCancel={switchTo.details}
          onDelete={() => {
            deleteAccounts([account.id])
              .then(() => {
                replace('/account-management');
                toast.success(t('Account deleted'));
              })
              .catch(() => {
                toast.error(t('Failed to delete account. Try again.'));
              });
          }}
        />
      </ViewHost>
    </>
  );
};
