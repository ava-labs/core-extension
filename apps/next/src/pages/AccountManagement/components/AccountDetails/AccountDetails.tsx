import { toast, ToastOptions } from '@avalabs/k2-alpine';
import { useAccountsContext } from '@core/ui';
import { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect, useHistory } from 'react-router-dom';
import { useAccountSearchParams } from '../../hooks/useAccountSearchParams';
import { ViewHost } from '../ViewHost';
import { PageContent } from './components/PageContent';
import { RenameAccount } from './components/RenameAccount';

const toastOptions: ToastOptions = {
  id: 'account-details-guard',
};

type View = 'details' | 'rename' | 'remove';

export const AccountDetails: FC = () => {
  const { t } = useTranslation();
  const { renameAccount } = useAccountsContext();
  const accountParams = useAccountSearchParams();
  const {
    push,
    location: { search },
  } = useHistory();

  const [view, setView] = useState<View>('details');
  const switchTo = useMemo(
    () => ({
      details: () => setView('details'),
      rename: () => setView('rename'),
      remove: () =>
        push({
          pathname: '/account-management/delete-account',
          search,
        }),
    }),
    [push, search],
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
    </>
  );
};
