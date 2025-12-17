import { useHistory, useLocation, useParams } from 'react-router-dom';
import { useAccountsContext, useWalletContext } from '@core/ui';
import { WalletDetails } from './components/WalletDetails';
import { ImportedAccountDetails } from './components/ImportedAccoutDetails';
import { isImportedAccount } from '@core/common';
import { LoadingScreen } from '@/components/LoadingScreen';
import { toast } from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { WALLET_VIEW_QUERY_TOKENS } from '@/config/routes';

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
      WALLET_VIEW_QUERY_TOKENS.showImportSuccess,
    );

    if (showImportSuccess) {
      toast.success(t('Wallet Imported'), { duration: 2000 });
      history.replace({ search: '' });
    }
  }, [t, search, history]);

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
