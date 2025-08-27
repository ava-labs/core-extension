import { CircularProgress, Stack, styled } from '@avalabs/k2-alpine';
import { useAccountsContext, useBalancesContext } from '@core/ui';
import { FC, useState } from 'react';
import AccountInfo from './components/AccountInfo';
import { EmptyState } from './components/EmptyState';
import NavigationBar, { TabName } from './components/NavigationBar';
import { PortfolioDetails } from './components/PortolioDetails';

export const PortfolioHome: FC = () => {
  const { accounts } = useAccountsContext();
  const [activeTab, setActiveTab] = useState<TabName>('assets');
  const { totalBalance } = useBalancesContext();
  const isLoading = !totalBalance;
  const isAccountEmpty = !isLoading && totalBalance.sum === 0;
  const PortfolioContent = isAccountEmpty ? EmptyState : PortfolioDetails;

  return (
    <Stack height={1} px={1.5} pb={1.5} gap={2.5}>
      <AccountInfo
        accountName={accounts.active?.name ?? ''}
        balance={totalBalance}
      />
      <Stack flexGrow={1} gap={2.5}>
        {isLoading ? <CenteredSpinner /> : <PortfolioContent tab={activeTab} />}
      </Stack>
      <NavigationBar active={activeTab} onChange={setActiveTab} />
    </Stack>
  );
};

const CenteredSpinner = styled(CircularProgress)({
  margin: 'auto',
});
