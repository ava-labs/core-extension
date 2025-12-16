import { Stack } from '@avalabs/k2-alpine';
import { WalletBalance } from './WalletBalance';
import { PortfolioActionButtons } from '../../PortfolioHome/components/PortolioDetails/components/PortfolioActionButtons';
import { WalletAccountsCard } from './WalletAccountsCard';
import { getAccountAvatars } from '../utils/accountAvatars';
import { useMemo } from 'react';
import { usePersonalAvatar } from '@/components/PersonalAvatar';
import {
  useAccountsContext,
  useBalancesContext,
  useSettingsContext,
} from '@core/ui';
import { useNetworksWithBalance } from '../hooks/useNetworksWithBalance';
import { WalletDetails as WalletDetailsType } from '@core/types';
import { getNetworkCount } from '../utils/networkCount';

type Props = {
  wallet: WalletDetailsType;
};
export const WalletDetails = ({ wallet }: Props) => {
  const { getAccountsByWalletId } = useAccountsContext();
  const { coreAssistant } = useSettingsContext();
  const accountsInWallet = getAccountsByWalletId(wallet.id);
  const networksWithBalance = useNetworksWithBalance({ walletId: wallet.id });
  const { getWalletTotalBalance } = useBalancesContext();
  const {
    isLoading,
    hasErrorOccurred,
    totalBalanceInCurrency,
    balanceChange,
    percentageChange,
  } = getWalletTotalBalance(wallet.id);
  const {
    selected: { name: userAvatarName },
  } = usePersonalAvatar();
  // Generate unique avatars for each account
  const accountAvatars = useMemo(() => {
    return getAccountAvatars({
      userAvatarName,
      accountsInWallet,
    });
  }, [accountsInWallet, userAvatarName]);

  const accountCount = useMemo(() => {
    return Object.keys(networksWithBalance).length;
  }, [networksWithBalance]);

  const networkCount = useMemo(() => {
    return getNetworkCount(networksWithBalance);
  }, [networksWithBalance]);

  return (
    <Stack p={1} mt={coreAssistant ? 3 : 1} gap={1} width="100%">
      <WalletBalance
        walletType={wallet.type}
        walletName={wallet.name}
        isLoading={isLoading}
        hasErrorOccurred={hasErrorOccurred}
        totalBalanceInCurrency={totalBalanceInCurrency}
        balanceChange={balanceChange}
        percentageChange={percentageChange}
      />
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
