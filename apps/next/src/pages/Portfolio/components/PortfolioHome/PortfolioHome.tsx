import {
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
import { FC, useState } from 'react';
import AccountInfo from './components/AccountInfo';
import { EmptyState } from './components/EmptyState';
import { PortfolioDetails } from './components/PortolioDetails';
import { useTranslation } from 'react-i18next';

export type TabName = 'assets' | 'collectibles' | 'defi' | 'activity';

export const PortfolioHome: FC = () => {
  const { t } = useTranslation();
  const { accounts } = useAccountsContext();
  const [activeTab, setActiveTab] = useState<TabName>('assets');
  const { networks } = useNetworkContext();
  const { totalBalance, balances } = useBalancesContext();
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
    <Stack height={1} px={1.5} gap={2}>
      <AccountInfo
        accountName={accounts.active?.name ?? ''}
        balance={totalBalance}
      />
      <Stack flexGrow={1} gap={2.5}>
        {isLoading ? <CenteredSpinner /> : <PortfolioContent tab={activeTab} />}
      </Stack>
      <TabBar
        tabBarItems={TABS}
        value={activeTab}
        onChange={(_, val) => {
          setActiveTab(val);
        }}
        size="extension"
      />
    </Stack>
  );
};

const CenteredSpinner = styled(CircularProgress)({
  margin: 'auto',
});
