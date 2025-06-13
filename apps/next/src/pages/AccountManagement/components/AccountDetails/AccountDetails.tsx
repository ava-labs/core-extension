import { Typography } from '@/components/Typography';
import { Stack, toast, ToastOptions, LinearProgress } from '@avalabs/k2-alpine';
import { SecretType } from '@core/types';
import { useAccountsContext, useWalletContext } from '@core/ui';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect, useLocation } from 'react-router-dom';
import { AddressesCard } from './components/AddressesCard';
import { AccountDetailsHeader } from './components/Header';
import { MoreDetailsCard } from './components/MoreDetailsCard';
import { ActionButtons } from './components/ActionButtons';

const toastOptions: ToastOptions = {
  id: 'account-details-guard',
};

export const AccountDetails: FC = () => {
  const { t } = useTranslation();
  const { search } = useLocation();
  const { getAccountById, renameAccount, deleteAccounts } =
    useAccountsContext();
  const { getWallet, wallets } = useWalletContext();
  const searchParams = new URLSearchParams(search);
  const accountId = searchParams.get('accountId');
  const walletId = searchParams.get('walletId');

  if (!accountId) {
    toast.error(t('Account Id is not provided'), toastOptions);
    return <Redirect to="/account-management" />;
  }

  const account = getAccountById(accountId);

  if (!account) {
    toast.error(t('Account not found'), toastOptions);
    return <Redirect to="/account-management" />;
  }

  if (wallets.length === 0) {
    return <LinearProgress />;
  }

  const wallet = walletId ? getWallet(walletId) : undefined;

  if (walletId && !wallet) {
    toast.error(t('Wallet not found'), toastOptions);
    return <Redirect to="/account-management" />;
  }

  return (
    <Stack height={1} gap={1.5}>
      <AccountDetailsHeader account={account} />
      <AddressesCard account={account} />
      <MoreDetailsCard
        walletName={wallet?.name ?? t('Imported Accounts')}
        walletType={wallet?.type ?? SecretType.PrivateKey}
      />
      <Typography variant="details" px={1.5} mt={-0.25} color="text.secondary">
        Your account&apos;s private key is a fixed password for accessing the
        specific addresses above. Keep it secure, anyone with this private key
        can access the account associated with it.
      </Typography>
      <ActionButtons
        onRename={() => {
          renameAccount(account.id, 'New Name');
        }}
        onRemove={() => {
          deleteAccounts([account.id]);
        }}
      />
    </Stack>
  );
};
