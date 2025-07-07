import { toast, ToastOptions } from '@avalabs/k2-alpine';
import { FC, useMemo } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import { useAccountSearchParams } from '../../hooks/useAccountSearchParams';
import { ViewHost } from '../ViewHost';
import { DetailsView } from './components/DetailsView';

const toastOptions: ToastOptions = {
  id: 'account-details-guard',
};

export const AccountDetails: FC = () => {
  const accountParams = useAccountSearchParams();
  const {
    push,
    location: { search },
  } = useHistory();

  const switchTo = useMemo(
    () => ({
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
    <ViewHost in>
      <DetailsView
        account={account}
        onRename={switchTo.rename}
        onRemove={switchTo.remove}
      />
    </ViewHost>
  );
};
