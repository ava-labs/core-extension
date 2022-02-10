import { LoadingSpinnerIcon, VerticalFlex } from '@avalabs/react-components';
import { Tabs } from '@src/components/common/Tabs';
import { useWalletContext } from '@src/contexts/WalletProvider';
import { Activity } from '@src/pages/Activity/Activity';
import { useTheme } from 'styled-components';
import { TokenList } from './TokenList';
import { WalletBalances } from './WalletBalances';

enum PortfolioTabs {
  ASSETS = 'ASSETS',
  ACTIVITY = 'ACTIVITY',
}

export function Portfolio() {
  const theme = useTheme();
  const { isBalanceLoading, isWalletReady } = useWalletContext();

  if (isBalanceLoading || !isWalletReady) {
    return (
      <VerticalFlex justify="center" height="100%">
        <LoadingSpinnerIcon color={theme.colors.primary1} />
      </VerticalFlex>
    );
  }

  return (
    <>
      <VerticalFlex grow="1">
        <WalletBalances />
        <Tabs
          margin="14px 0 0"
          tabs={[
            {
              title: 'Assets',
              id: PortfolioTabs.ASSETS,
              component: <TokenList />,
            },
            {
              title: 'Activity',
              id: PortfolioTabs.ACTIVITY,
              component: <Activity />,
            },
          ]}
        />
      </VerticalFlex>
    </>
  );
}
