import { LoadingScreen } from '@/components/LoadingScreen';
import { isImportedAccount } from '@core/common';
import { useAccountsContext, useWalletContext } from '@core/ui';
import { useParams } from 'react-router-dom';
import { ImportedAccountDetails } from './components/ImportedAccoutDetails';
import { WalletDetails } from './components/WalletDetails';

const WalletViewContent = () => {
  const { walletId } = useParams<{ walletId: string }>();
  const { getWallet } = useWalletContext();
  const { getAccountById } = useAccountsContext();

  const wallet = getWallet(walletId);
  const account = getAccountById(walletId);

  if (wallet) {
    return <WalletDetails wallet={wallet} />;
  }

  if (isImportedAccount(account)) {
    return <ImportedAccountDetails account={account} />;
  }

  return <LoadingScreen />;
};

export const WalletView = () => {
  return <WalletViewContent />;
};
