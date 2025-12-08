import { useParams } from 'react-router-dom';
import { useAccountsContext, useWalletContext } from '@core/ui';
import { WalletDetails } from './components/WalletDetails';
import { ImportedAccountDetails } from './components/ImportedAccoutDetails';
import { isImportedAccount } from '@core/common';
import { WalletError } from './components/WalletError';
import { LoadingScreen } from '@/components/LoadingScreen';

const WalletViewContent = () => {
  const { walletId } = useParams<{ walletId: string }>();
  const { getWallet } = useWalletContext();
  const { getAccountById } = useAccountsContext();

  const wallet = getWallet(walletId);

  if (!wallet) {
    return <LoadingScreen />;
  }

  if (wallet) {
    return <WalletDetails wallet={wallet} />;
  }
  const account = getAccountById(walletId);
  if (isImportedAccount(account)) {
    return <ImportedAccountDetails account={account} />;
  }
  return <WalletError />;
};

export const WalletView = () => {
  return <WalletViewContent />;
};
