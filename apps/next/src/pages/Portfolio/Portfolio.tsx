import { Box, Stack } from '@avalabs/k2-alpine';
import { useAccountsContext, useBalancesContext } from '@core/ui';
import { FC, useState } from 'react';
import AccountInfo from './components/AccountInfo';
import NavigationBar, { TabName } from './components/NavigationBar';
import { OnRampForm } from './components/OnRampForm';
import { PortfolioDetails } from './components/PortolioDetails';

export const Portfolio: FC = () => {
  const { accounts } = useAccountsContext();
  const [activeTab, setActiveTab] = useState<TabName>('assets');
  const { totalBalance } = useBalancesContext();
  const isAccountEmpty = totalBalance?.sum === 0;
  const PortfolioPage = isAccountEmpty ? OnRampForm : PortfolioDetails;
  return (
    <Stack height={1} px={1.5} pb={1.5} gap={2.5}>
      <AccountInfo
        accountName={accounts.active?.name ?? ''}
        balance={totalBalance}
      />
      <Box flexGrow={1}>
        <PortfolioPage />
      </Box>
      <NavigationBar active={activeTab} onChange={setActiveTab} />
    </Stack>
  );
};
