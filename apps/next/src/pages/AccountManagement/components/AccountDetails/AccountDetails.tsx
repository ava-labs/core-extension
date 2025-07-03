import { toast, ToastOptions } from '@avalabs/k2-alpine';
import { useAccountsContext } from '@core/ui';
import { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect, useHistory } from 'react-router-dom';
import { useAccountSearchParams } from '../../hooks/useAccountSearchParams';
import { PageContent } from './components/PageContent';
import { RemoveAccount } from './components/RemoveAccount';
import { RenameAccount } from './components/RenameAccount';
import { ViewHost } from './components/ViewHost';

const toastOptions: ToastOptions = {
  id: 'account-details-guard',
};

const VIEWS = ['details', 'rename', 'remove'] as const;
type View = (typeof VIEWS)[number];

export const AccountDetails: FC = () => {
  const { t } = useTranslation();
  const { replace } = useHistory();
  const { renameAccount, deleteAccounts } = useAccountsContext();
  const accountParams = useAccountSearchParams();

  const [view, setView] = useState<View>('details');
  const switchTo = useMemo(
    () =>
      VIEWS.reduce(
        (acc, viewName) => {
          acc[viewName] = () => setView(viewName);
          return acc;
        },
        {} as Record<View, VoidFunction>,
      ),
    [setView],
  );

  if (!accountParams.success) {
    toast.error(accountParams.error, toastOptions);
    return <Redirect to="/account-management" />;
  }

  const { account } = accountParams;

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
