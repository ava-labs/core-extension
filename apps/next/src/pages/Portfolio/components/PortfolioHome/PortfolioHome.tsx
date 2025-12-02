import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import {
  alpha,
  CircularProgress,
  Stack,
  styled,
  TabBar,
  TabBarItemProps,
} from '@avalabs/k2-alpine';
import { hasAccountBalances } from '@core/common';
import {
  useAccountsContext,
  useBalancesContext,
  useNetworkContext,
} from '@core/ui';

import { TESTNET_MODE_BACKGROUND_COLOR } from '@/config/constants';
import { NoScrollStack } from '@/components/NoScrollStack';
import { TestnetModeOverlay } from '@/components/TestnetModeOverlay';

import AccountInfo from './components/AccountInfo';
import { EmptyState } from './components/EmptyState';
import { PortfolioDetails } from './components/PortolioDetails';
import { AtomicFundsBalance } from './components/AtomicFundsBalance';

export type TabName = 'assets' | 'collectibles' | 'defi' | 'activity';

export const PortfolioHome: FC = () => {
  const { t } = useTranslation();

  /**
   * TODO: This is a temporary solution to get the active tab from the URL.
   */
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const activeTabFromParams = queryParams.get('activeTab') as TabName;
  const history = useHistory();

  const { accounts } = useAccountsContext();
  const [activeTab, setActiveTab] = useState<TabName>(
    activeTabFromParams ?? 'assets',
  );
  const { networks, isDeveloperMode } = useNetworkContext();
  const { totalBalance, balances, getAtomicBalance } = useBalancesContext();
  const walletId =
    accounts.active?.type === 'primary' ? accounts.active.walletId : undefined;
  const atomicBalance = getAtomicBalance(walletId);
  const atomicBalanceExists = !!atomicBalance;
  const isLoading = !totalBalance;
  const isAccountEmpty =
    !hasAccountBalances(
      balances.tokens ?? {},
      accounts.active ?? {},
      networks.map((n) => n.chainId),
    ) && !isLoading;

  const TABS: TabBarItemProps[] = [
    {
      id: 'assets',
      label: t('Assets'),
    },
    {
      id: 'collectibles',
      label: t('Collectibles'),
    },
    {
      id: 'defi',
      label: t('DeFi'),
    },
    {
      id: 'activity',
      label: t('Activity'),
    },
  ];

  const PortfolioContent = isAccountEmpty ? EmptyState : PortfolioDetails;

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
      >
        <Stack gap={1.5} px={1.5} flexGrow={1}>
          <AccountInfo
            accountName={accounts.active?.name ?? ''}
            balance={totalBalance}
            isDeveloperMode={isDeveloperMode}
          />
          {!!walletId &&
            atomicBalanceExists &&
            (atomicBalance.isLoading ? (
              <CenteredSpinner />
            ) : (
              <AtomicFundsBalance
                atomicBalance={atomicBalance.balanceDisplayValue!}
              />
            ))}
          <Stack flexGrow={1} gap={2.5}>
            {isLoading ? (
              <CenteredSpinner />
            ) : (
              <PortfolioContent tab={activeTab} />
            )}
          </Stack>
        </Stack>
        <TabsContainer>
          <TabBar
            tabBarItems={TABS}
            value={activeTabFromParams ?? activeTab}
            onChange={(_, val) => {
              queryParams.set('activeTab', val);
              history.push({
                pathname: location.pathname,
                search: queryParams.toString(),
              });
              setActiveTab(val as TabName);
            }}
            size="extension"
          />
        </TabsContainer>
      </NoScrollStack>
      {isDeveloperMode && (
        <TestnetModeOverlay
          verticalLines={[12, -12]}
          horizontalLines={[56, 116, 150, 170]}
        />
      )}
    </>
  );
};

const TabsContainer = styled(Stack)(({ theme }) => ({
  position: 'sticky',
  bottom: 0,
  paddingTop: theme.spacing(1),
  zIndex: theme.zIndex.appBar,
  background: `linear-gradient(180deg, ${alpha(theme.palette.background.default, 0)} 0%, ${theme.palette.background.default} 16px)`,

  '> div': {
    background: 'unset',
  },
}));

const CenteredSpinner = styled(CircularProgress)({
  margin: 'auto',
});
