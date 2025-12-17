import { FC, useState } from 'react';
import { Stack, TabBarItemProps } from '@avalabs/k2-alpine';
import { isEmptyAccount, isPrimaryAccount } from '@core/common';
import {
  useAccountsContext,
  useBalancesContext,
  useNetworkContext,
  useAnalyticsContext,
  useWalletTotalBalance,
} from '@core/ui';
import { IMPORTED_ACCOUNTS_WALLET_ID } from '@core/types';

import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import { TabsContainer, TabBar } from '../styled';

import { TabName } from '../types';
import { EmptyState } from './EmptyState';
import { LoadingState } from './LoadingState';
import { PortfolioDetails } from './PortolioDetails';

export const PortfolioTabs: FC = () => {
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
  const { networks } = useNetworkContext();
  const { totalBalance, balances } = useBalancesContext();

  const { totalBalanceInCurrency, isLoading: isWalletLoading } =
    useWalletTotalBalance(
      isPrimaryAccount(accounts.active)
        ? accounts.active.walletId
        : IMPORTED_ACCOUNTS_WALLET_ID,
    );

  const isLoading = balances.loading || !totalBalance || isWalletLoading;
  const isAccountEmpty =
    !isLoading && isEmptyAccount(balances.tokens, accounts.active, networks);
  const isWalletEmpty = !totalBalanceInCurrency || totalBalanceInCurrency === 0;

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
  ];

  if (!isAccountEmpty) {
    TABS.push({
      id: 'activity',
      label: t('Activity'),
    });
  }

  const PortfolioContent = isWalletEmpty ? EmptyState : PortfolioDetails;

  return (
    <Stack gap={2.5} px={1.5} flexGrow={1}>
      <Stack flexGrow={1} gap={2.5}>
        {isLoading ? <LoadingState /> : <PortfolioContent tab={activeTab} />}
      </Stack>
      <TabsContainer>
        <TabBar
          tabBarItems={TABS}
          value={activeTabFromParams ?? activeTab}
          onChange={(_, val) => {
            history.replace({
              pathname: location.pathname,
              search: `?activeTab=${val}`, // Reset any params other than activeTab
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
    </Stack>
  );
};
