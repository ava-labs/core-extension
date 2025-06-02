import { useWalletContext } from '@core/ui';
import WalletCard from './components/WalletCard';
import { FC } from 'react';

export const Wallets: FC = () => {
  const { wallets } = useWalletContext();
  return wallets.map((wallet) => (
    <WalletCard key={wallet.id} wallet={wallet} />
  ));
};
