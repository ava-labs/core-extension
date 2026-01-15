import { FC } from 'react';
import { Stack } from '@avalabs/k2-alpine';
import {
  AccountAtomicBalanceState,
  useAccountsContext,
  useBalancesContext,
  useNetworkContext,
} from '@core/ui';

import { AccountInfo } from './components/AccountInfo/AccountInfo';
import { TestnetModeOverlay } from '@/components/TestnetModeOverlay';
import { AtomicFundsBalance } from './components/AtomicFundsBalance';
import { PortfolioTabs } from './components/PortfolioTabs';
import { EnsureDefined } from '@core/types';
import { NoScrollStack } from '@/components/NoScrollStack';

const hasAtomicBalance = (
  atomicBalance?: AccountAtomicBalanceState,
): atomicBalance is EnsureDefined<
  AccountAtomicBalanceState,
  'balanceDisplayValue'
> => {
  return Boolean(atomicBalance && atomicBalance.balanceDisplayValue);
};

export const PortfolioHome: FC = () => {
  const { accounts } = useAccountsContext();
  const { isDeveloperMode } = useNetworkContext();
  const { totalBalance, getAtomicBalance } = useBalancesContext();
  const atomicBalance = getAtomicBalance(accounts.active?.id);

  return (
    <>
      <NoScrollStack data-scroll-container="portfolio-content">
        <Stack gap={2.5} px={1.5}>
          <AccountInfo
            account={accounts.active}
            balance={totalBalance}
            isDeveloperMode={isDeveloperMode}
          />

          {hasAtomicBalance(atomicBalance) && (
            <AtomicFundsBalance
              atomicBalance={atomicBalance.balanceDisplayValue}
            />
          )}
        </Stack>
        <PortfolioTabs />
      </NoScrollStack>
      {isDeveloperMode && (
        <TestnetModeOverlay
          verticalLines={[12, -12]}
          horizontalLines={[56, 128, 160, 178]}
        />
      )}
    </>
  );
};
