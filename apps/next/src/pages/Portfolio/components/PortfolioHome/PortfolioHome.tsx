import { FC } from 'react';
import { NoScrollStack } from '@/components/NoScrollStack';
import { Stack } from '@avalabs/k2-alpine';
import {
  AccountAtomicBalanceState,
  useAccountsContext,
  useBalancesContext,
  useNetworkContext,
} from '@core/ui';

import AccountInfo from './components/AccountInfo/AccountInfo';
import { TestnetModeOverlay } from '@/components/TestnetModeOverlay';
import { AtomicFundsBalance } from './components/AtomicFundsBalance';
import { TESTNET_MODE_BACKGROUND_COLOR } from '@/config/constants';
import { PortfolioTabs } from './components/PortfolioTabs';
import { EnsureDefined } from '@core/types';

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
      <NoScrollStack
        height={1}
        data-scroll-container="portfolio-content"
        // TODO: The "testnet" color palette needs to be updated, but core.app is already using it.
        // In Extension, we only need to change the background color of the home scren (portfolio page),
        // meanwhile the "testnet" color scheme changes the palette's "background.default" property,
        // so it affects the entire UI.
        bgcolor={
          isDeveloperMode ? TESTNET_MODE_BACKGROUND_COLOR : 'background.default'
        }
        gap={2.5}
      >
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
