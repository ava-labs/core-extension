import {
  CircularProgress,
  Stack,
  styled,
  TabBar,
  TabBarItemProps,
} from '@avalabs/k2-alpine';
import { useAccountsContext, useBalancesContext } from '@core/ui';
import { FC, useState } from 'react';
import AccountInfo from './components/AccountInfo';
import { EmptyState } from './components/EmptyState';
import { PortfolioDetails } from './components/PortolioDetails';
import { useTranslation } from 'react-i18next';

export type TabName = 'assets' | 'collectibles' | 'defi' | 'activity';

export const Portfolio: FC = () => {
  const { t } = useTranslation();
  const { accounts } = useAccountsContext();
  const [activeTab, setActiveTab] = useState<TabName>('assets');
  const { totalBalance } = useBalancesContext();
  const isLoading = !totalBalance;
  const isAccountEmpty = !isLoading && totalBalance.sum === 0;
  const PortfolioContent = isAccountEmpty ? EmptyState : PortfolioDetails;

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

  return (
    <Stack height={1} px={1.5} pb={1.5} gap={2.5}>
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
