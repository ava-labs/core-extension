import { useMemo } from 'react';
import { usePersonalAvatar } from '@/components/PersonalAvatar';
import { useBalancesContext } from '@core/ui';
import { useNetworksWithBalance } from '../hooks/useNetworksWithBalance';
import { getAccountAvatars } from '../utils/accountAvatars';
import { WalletBalance } from './WalletBalance';
import { useTranslation } from 'react-i18next';
import { ImportedAccount } from '@core/types';
import { Stack } from '@avalabs/k2-alpine';
import { PortfolioActionButtons } from '../../PortfolioHome/components/PortolioDetails/components/PortfolioActionButtons';
import { WalletAccountsCard } from './WalletAccountsCard';
import { getNetworkCount } from '../utils/networkCount';

type Props = {
  account: ImportedAccount;
};
export const ImportedAccountDetails = ({ account }: Props) => {
  const { t } = useTranslation();
  const { getTotalBalance } = useBalancesContext();
  const balance = getTotalBalance(account.addressC);
  const networksWithBalance = useNetworksWithBalance({ accountId: account.id });

  const {
    selected: { name: userAvatarName },
  } = usePersonalAvatar();
  // Generate unique avatars for each account
  const accountAvatars = useMemo(() => {
    return getAccountAvatars({
      userAvatarName,
      accountsInWallet: [account],
    });
  }, [userAvatarName, account]);

  const networkCount = useMemo(() => {
    return getNetworkCount(networksWithBalance);
  }, [networksWithBalance]);
  const percentageChange = useMemo(() => {
    const amountChange = balance?.priceChange?.value;
    const currentBalance = balance?.sum;

    if (
      amountChange === undefined ||
      currentBalance === undefined ||
      currentBalance === null
    )
      return undefined;
    if (amountChange === 0) return 0;

    return (amountChange / (currentBalance - amountChange)) * 100;
  }, [balance]);

  return (
    <Stack p={1} mt={2} gap={1}>
      <WalletBalance
        walletName={t('Imported')}
        isLoading={false}
        hasErrorOccurred={false}
        totalBalanceInCurrency={balance?.sum ?? undefined}
        balanceChange={balance?.priceChange?.value}
        percentageChange={percentageChange}
      />
      <PortfolioActionButtons />
      <WalletAccountsCard
        accountCount={1}
        networkCount={networkCount}
        accountsInWallet={[account]}
        accountAvatars={accountAvatars}
        networksWithBalance={networksWithBalance}
      />
    </Stack>
  );
};
