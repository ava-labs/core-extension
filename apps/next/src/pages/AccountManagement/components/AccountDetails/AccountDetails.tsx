import { toast, ToastOptions } from '@avalabs/k2-alpine';
import { FC, useMemo, useState } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import { useAccountSearchParams } from '../../hooks/useAccountSearchParams';
import { ViewHost } from '../ViewHost';
import { DetailsView } from './components/DetailsView';

const toastOptions: ToastOptions = {
  id: 'account-details-guard',
};

type View = 'details' | 'rename' | 'remove';

export const AccountDetails: FC = () => {
  const accountParams = useAccountSearchParams();
  const {
    push,
    location: { search },
  } = useHistory();

  const [view, setView] = useState<View>('details');
  const switchTo = useMemo(
    () => ({
      details: () => setView('details'),
      rename: () =>
        push({
          pathname: '/account-management/rename',
          search,
        }),
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
    <ViewHost in={view === 'details'}>
      <DetailsView
        account={account}
        onRename={switchTo.rename}
        onRemove={switchTo.remove}
      />
    </ViewHost>
  );
};
