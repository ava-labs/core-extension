import { Stack } from '@avalabs/k2-alpine';
import {
  useAccountsContext,
  useBalancesContext,
  useNetworkContext,
} from '@core/ui';
import { FC, useMemo } from 'react';

import { TestnetModeOverlay } from '@/components/TestnetModeOverlay';
import { useHypercoreBalanceInCurrency } from '@/hooks/useHypercoreBalanceInCurrency';
import { AccountInfo } from './components/AccountInfo/AccountInfo';
import { AtomicFundsBalance } from './components/AtomicFundsBalance';
import { PortfolioTabs } from './components/PortfolioTabs';

export const PortfolioHome: FC = () => {
  const { accounts } = useAccountsContext();
  const { isDeveloperMode } = useNetworkContext();
  const { totalBalance, balances } = useBalancesContext();
  const hypercoreBalanceInCurrency = useHypercoreBalanceInCurrency(
    accounts.active,
  );

  const balanceWithHypercore = useMemo(() => {
    if (!totalBalance || hypercoreBalanceInCurrency === 0) {
      return totalBalance;
    }

    return {
      ...totalBalance,
      sum: (totalBalance.sum ?? 0) + hypercoreBalanceInCurrency,
    };
  }, [hypercoreBalanceInCurrency, totalBalance]);

  return (
    <>
      <Stack gap={2.5} px={1.5} mb={2.5}>
        <AccountInfo
          account={accounts.active}
          balance={balanceWithHypercore}
          isDeveloperMode={isDeveloperMode}
          hasBalanceError={!!balances.error}
          isLoading={balances.loading}
        />
        <AtomicFundsBalance accountId={accounts.active?.id} />
      </Stack>
      <PortfolioTabs />
      {isDeveloperMode && (
        <TestnetModeOverlay
          verticalLines={[12, -12]}
          horizontalLines={[56, 128, 160, 178]}
        />
      )}
    </>
  );
};
