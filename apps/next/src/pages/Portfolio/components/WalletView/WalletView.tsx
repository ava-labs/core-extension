import { useParams } from 'react-router-dom';
import {
  useAccountsContext,
  useWalletContext,
  WalletTotalBalanceProvider,
} from '@core/ui';
import { WalletDetails } from './components/WalletDetails';
import { ImportedAccountDetails } from './components/ImportedAccoutDetails';
import { isImportedAccount } from '@core/common';
import { WalletError } from './components/WalletError';

const WalletViewContent = () => {
  const { walletId } = useParams<{ walletId: string }>();
  const { getWallet } = useWalletContext();
  const { getAccountById } = useAccountsContext();

  const wallet = getWallet(walletId);
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
  return (
    <WalletTotalBalanceProvider>
      <WalletViewContent />
    </WalletTotalBalanceProvider>
  );
};
