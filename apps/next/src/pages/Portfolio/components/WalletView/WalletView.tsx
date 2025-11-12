import { useParams } from 'react-router-dom';
import { useAccountsContext, useWalletContext } from '@core/ui';

export const WalletView = () => {
  const { walletId } = useParams<{ walletId: string }>();
  const { getWallet } = useWalletContext();
  const { getAccountsByWalletId } = useAccountsContext();
  const wallet = getWallet(walletId);
  const accounts = getAccountsByWalletId(walletId);

  return (
    <>
      <div>{wallet?.name}</div>
      <div>{accounts.map((account) => account.name).join(', ')}</div>
    </>
  );
};
