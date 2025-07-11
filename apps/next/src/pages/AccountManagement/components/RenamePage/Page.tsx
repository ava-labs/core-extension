import { FC } from 'react';
import { Redirect } from 'react-router-dom';
import { useAccountSearchParams } from '../../hooks/useAccountSearchParams';
import { useWalletSearchParams } from '../../hooks/useWalletSearchParams';
import { RenameAccountForm } from './components/AccountForm';
import { RenameWalletForm } from './components/WalletForm';

export const RenamePage: FC = () => {
  const accountParams = useAccountSearchParams(false);
  const walletParams = useWalletSearchParams();

  if (walletParams.success) {
    return <RenameWalletForm wallet={walletParams.wallet} />;
  }

  if (accountParams.success) {
    return <RenameAccountForm account={accountParams.account} />;
  }

  return <Redirect to="/account-management" />;
};
