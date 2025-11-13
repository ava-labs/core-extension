import { toast, ToastOptions } from '@avalabs/k2-alpine';
import { FC, useMemo } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import { Page } from '@/components/Page';
import { useAccountSearchParams } from '../../hooks/useAccountSearchParams';
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
    <Page
      withBackButton
      containerProps={{
        mt: 3,
      }}
      contentProps={{
        alignItems: 'stretch',
        justifyContent: 'flex-start',
      }}
    >
      <DetailsView
        account={account}
        onRename={switchTo.rename}
        onRemove={switchTo.remove}
      />
    </Page>
  );
};
