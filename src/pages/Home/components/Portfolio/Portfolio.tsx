import { LoadingSpinnerIcon, VerticalFlex } from '@avalabs/react-components';
import { Tabs } from '@src/components/common/Tabs';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { useBalancesContext } from '@src/contexts/BalancesProvider';
import { useBridgeContext } from '@src/contexts/BridgeProvider';
import { Activity } from '@src/pages/Activity/Activity';
import { useTheme } from 'styled-components';
import { Collectibles } from '../../../Collectibles/Collectibles';
import { NetworksWidget } from './NetworkWidget/NetworksWidget';
import { WalletBalances } from './WalletBalances';

enum PortfolioTabs {
  ASSETS = 'ASSETS',
  COLLECTIBLES = 'COLLECTIBLES',
  ACTIVITY = 'ACTIVITY',
}

export function Portfolio() {
  const theme = useTheme();
  const { tokens } = useBalancesContext();
  const { bridgeTransactions } = useBridgeContext();
  const { capture } = useAnalyticsContext();

  if (tokens.loading) {
    return (
      <VerticalFlex justify="center" align="center" height="100%">
        <LoadingSpinnerIcon
          width="32px"
          height="32px"
          color={theme.colors.primary1}
        />
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
              component: <NetworksWidget />,
              onClick: () => capture('PortfolioAssetsClicked'),
            },
            {
              title: 'Collectibles',
              id: PortfolioTabs.COLLECTIBLES,
              component: <Collectibles />,
              onClick: () => capture('PortfolioCollectiblesClicked'),
            },
            {
              title: 'Activity',
              id: PortfolioTabs.ACTIVITY,
              component: <Activity />,
              badgeAmount:
                bridgeTransactions && Object.values(bridgeTransactions).length,
              onClick: () => capture('PortfolioActivityClicked'),
            },
          ]}
        />
      </VerticalFlex>
    </>
  );
}
