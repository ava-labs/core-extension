import {
  LinearProgress,
  Stack,
  toast,
  ToastOptions,
  Typography,
} from '@avalabs/k2-alpine';
import { SecretType } from '@core/types';
import { useAccountsContext, useWalletContext } from '@core/ui';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect, useHistory, useLocation } from 'react-router-dom';
import { ActionButtons } from './components/ActionButtons';
import { AddressesCard } from './components/AddressesCard';
import { AccountDetailsHeader } from './components/Header';
import { MoreDetailsCard } from './components/MoreDetailsCard';

const toastOptions: ToastOptions = {
  id: 'account-details-guard',
};

export const AccountDetails: FC = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const accountId = searchParams.get('accountId');

  const { getWallet, wallets } = useWalletContext();
  const { getAccountById, renameAccount, deleteAccounts } =
    useAccountsContext();

  if (!accountId) {
    toast.error(t('Account Id is not provided'), toastOptions);
    return <Redirect to="/account-management" />;
  }

  const account = getAccountById(accountId);

  if (!account) {
    toast.error(t('Account not found'), toastOptions);
    return <Redirect to="/account-management" />;
  }

  const isPrimaryAccount = account.type === 'primary';

  if (isPrimaryAccount && wallets.length === 0) {
    return <LinearProgress />;
  }

  const wallet = isPrimaryAccount ? getWallet(account.walletId) : undefined;

  return (
    <Stack height={1} gap={1.5}>
      <AccountDetailsHeader account={account} />
      <AddressesCard account={account} />
      <MoreDetailsCard
        walletName={wallet?.name ?? t('Imported Accounts')}
        walletType={wallet?.type ?? SecretType.PrivateKey}
      />
      <Typography variant="caption" px={1.5} mt={-0.25} color="text.secondary">
        Your account&apos;s private key is a fixed password for accessing the
        specific addresses above. Keep it secure, anyone with this private key
        can access the account associated with it.
      </Typography>
      <ActionButtons
        onRename={() => {
          // TODO: Implement rename account screen
          const newName = prompt('Enter new account name');
          if (newName) {
            renameAccount(account.id, newName);
          }
        }}
        onRemove={async () => {
          // TODO: Implement proper delete account dialog
          const confirmed = confirm(
            'Are you sure you want to delete this account?',
          );
          if (confirmed) {
            deleteAccounts([account.id]).then(() => {
              history.push('/account-management');
              toast.success(t('Account deleted'), toastOptions);
            });
          }
        }}
      />
    </Stack>
  );
};
