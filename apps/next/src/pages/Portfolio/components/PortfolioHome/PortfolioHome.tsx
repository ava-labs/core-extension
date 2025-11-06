import { Box, CircularProgress, Stack, styled } from '@avalabs/k2-alpine';
import { hasAccountBalances } from '@core/common';
import {
  useAccountsContext,
  useBalancesContext,
  useNetworkContext,
} from '@core/ui';
import { FC, useState } from 'react';
import AccountInfo from './components/AccountInfo';
import { EmptyState } from './components/EmptyState';
import NavigationBar, { TabName } from './components/NavigationBar';
import { PortfolioDetails } from './components/PortolioDetails';

export const PortfolioHome: FC = () => {
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

  const PortfolioContent = isAccountEmpty ? EmptyState : PortfolioDetails;

  return (
    <Stack
      height={1}
      px={1.5}
      pb={1.5}
      gap={2.5}
      data-scroll-container="portfolio-content"
      sx={{ overflow: 'auto' }}
    >
      <AccountInfo
        accountName={accounts.active?.name ?? ''}
        balance={totalBalance}
      />
      <Stack flexGrow={1} gap={2.5} sx={{ minHeight: 0 }}>
        {isLoading ? <CenteredSpinner /> : <PortfolioContent tab={activeTab} />}
        <Box
          sx={{
            position: 'sticky',
            bottom: 0,
            backgroundColor: 'background.default',
            zIndex: 10,
            mt: 'auto',
          }}
        >
          <NavigationBar active={activeTab} onChange={setActiveTab} />
        </Box>
      </Stack>
    </Stack>
  );
};

const CenteredSpinner = styled(CircularProgress)({
  margin: 'auto',
});
