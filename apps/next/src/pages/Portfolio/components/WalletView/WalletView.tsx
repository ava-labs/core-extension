import { useParams } from 'react-router-dom';
import {
  useAccountsContext,
  useWalletContext,
  WalletTotalBalanceProvider,
} from '@core/ui';
import { Stack } from '@avalabs/k2-alpine';
import { PortfolioActionButtons } from '../PortfolioHome/components/PortolioDetails/components/PortfolioActionButtons';
import { usePersonalAvatar } from '@/components/PersonalAvatar';
import { useMemo } from 'react';
import { useNetworksWithBalance } from './hooks/useNetworksWithBalance';
import { getAccountAvatars } from './utils/accountAvatars';
import { WalletBalance } from './components/WalletBalance';
import { WalletAccountsCard } from './components/WalletAccountsCard';

const WalletViewContent = () => {
  const { walletId } = useParams<{ walletId: string }>();
  const { getWallet } = useWalletContext();
  const { getAccountsByWalletId } = useAccountsContext();
  const {
    selected: { name: userAvatarName },
  } = usePersonalAvatar();
  const networksWithBalance = useNetworksWithBalance(walletId);

  const wallet = getWallet(walletId);
  const accountsInWallet = getAccountsByWalletId(walletId);

  // Generate unique avatars for each account
  const accountAvatars = useMemo(() => {
    return getAccountAvatars(userAvatarName, accountsInWallet);
  }, [accountsInWallet, userAvatarName]);

  const accountCount = useMemo(() => {
    return Object.keys(networksWithBalance).length;
  }, [networksWithBalance]);

  const networkCount = useMemo(() => {
    const allNetworks = Object.values(networksWithBalance).flat();
    const uniqueChainIds = new Set(
      allNetworks.map((network) => network.chainId),
    );
    return uniqueChainIds.size;
  }, [networksWithBalance]);

  if (!wallet) return null;

  return (
    <Stack p={1} mt={2} gap={1}>
      <WalletBalance wallet={wallet} />
      <PortfolioActionButtons />
      <WalletAccountsCard
        accountCount={accountCount}
        networkCount={networkCount}
        accountsInWallet={accountsInWallet}
        accountAvatars={accountAvatars}
        networksWithBalance={networksWithBalance}
      />
    </Stack>
  );
};

export const WalletView = () => {
  return (
    <WalletTotalBalanceProvider>
      <WalletViewContent />
    </WalletTotalBalanceProvider>
  );
};
