import { FC, useState } from 'react';
import { NoScrollStack } from '@/components/NoScrollStack';
import { Stack, TabBarItemProps } from '@avalabs/k2-alpine';
import { isEmptyAccount } from '@core/common';
import {
  useAccountsContext,
  useBalancesContext,
  useNetworkContext,
  useAnalyticsContext,
} from '@core/ui';

import AccountInfo from './components/AccountInfo/AccountInfo';
import { TestnetModeOverlay } from '@/components/TestnetModeOverlay';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import { EmptyState } from './components/EmptyState';
import { LoadingState } from './components/LoadingState';
import { PortfolioDetails } from './components/PortolioDetails';
import { AtomicFundsBalance } from './components/AtomicFundsBalance';
import { TESTNET_MODE_BACKGROUND_COLOR } from '@/config/constants';
import { TabsContainer, TabBar } from './styled';

import { TabName } from './types';

export const PortfolioHome: FC = () => {
  const { t } = useTranslation();

  /**
   * TODO: This is a temporary solution to get the active tab from the URL.
   */
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const activeTabFromParams = queryParams.get('activeTab') as TabName;
  const history = useHistory();
  const { capture } = useAnalyticsContext();

  const { accounts } = useAccountsContext();
  const [activeTab, setActiveTab] = useState<TabName>(
    activeTabFromParams ?? 'assets',
  );
  const { networks, isDeveloperMode } = useNetworkContext();
  const { totalBalance, balances, getAtomicBalance } = useBalancesContext();
  const accountId =
    accounts.active?.type === 'primary' ? accounts.active.id : undefined;
  const atomicBalance = getAtomicBalance(accountId);
  const atomicBalanceExists = !!atomicBalance;

  const isLoading = balances.loading || !totalBalance;
  const isAccountEmpty =
    !isLoading && isEmptyAccount(balances.tokens, accounts.active, networks);

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
        <Stack gap={2.5} px={1.5} flexGrow={1}>
          <AccountInfo
            account={accounts.active}
            balance={totalBalance}
            isDeveloperMode={isDeveloperMode}
          />
          {!!accountId &&
            atomicBalanceExists &&
            (atomicBalance.isLoading ? (
              <LoadingState />
            ) : (
              <AtomicFundsBalance
                atomicBalance={atomicBalance.balanceDisplayValue!}
              />
            ))}
          <Stack flexGrow={1} gap={2.5}>
            {isLoading ? (
              <LoadingState />
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
              if (val === 'assets') {
                capture('PortfolioAssetsClicked');
              } else if (val === 'collectibles') {
                capture('PortfolioCollectiblesClicked');
              } else if (val === 'defi') {
                capture('PortfolioDefiClicked');
              }
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
