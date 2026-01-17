import { Stack } from '@avalabs/k2-alpine';
import {
  useAccountsContext,
  useBalancesContext,
  useNetworkContext,
} from '@core/ui';
import { FC } from 'react';

import { TestnetModeOverlay } from '@/components/TestnetModeOverlay';
import { AccountInfo } from './components/AccountInfo/AccountInfo';
import { AtomicFundsBalance } from './components/AtomicFundsBalance';
import { PortfolioTabs } from './components/PortfolioTabs';

export const PortfolioHome: FC = () => {
  const { accounts } = useAccountsContext();
  const { isDeveloperMode } = useNetworkContext();
  const { totalBalance } = useBalancesContext();

  return (
    <>
      <Stack gap={2.5} px={1.5} mb={2.5}>
        <AccountInfo
          account={accounts.active}
          balance={totalBalance}
          isDeveloperMode={isDeveloperMode}
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
