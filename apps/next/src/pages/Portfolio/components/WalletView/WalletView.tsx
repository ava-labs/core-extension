import { useHistory, useLocation, useParams } from 'react-router-dom';
import { useAccountsContext, useWalletContext } from '@core/ui';
import { WalletDetails } from './components/WalletDetails';
import { ImportedAccountDetails } from './components/ImportedAccoutDetails';
import { isImportedAccount } from '@core/common';
import { WalletError } from './components/WalletError';
import { LoadingScreen } from '@/components/LoadingScreen';
import { toast } from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { WALLET_VIEW_URL_SEARCH_TOKENS } from './utils/searchParams';

const WalletViewContent = () => {
  const { walletId } = useParams<{ walletId: string }>();
  const { search } = useLocation();
  const { getWallet } = useWalletContext();
  const { getAccountById } = useAccountsContext();
  const { t } = useTranslation();
  const history = useHistory();

  useEffect(() => {
    const searchParams = new URLSearchParams(search);
    const showImportSuccess = searchParams.get(
      WALLET_VIEW_URL_SEARCH_TOKENS.showImportSuccess,
    );

    if (showImportSuccess) {
      toast.success(t('Wallet Imported'), { duration: 2000 });
      history.replace({ search: '' });
    }
  }, [t, search, history]);

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
