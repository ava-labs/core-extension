import { VerticalFlex } from '@avalabs/react-components';
import { Tabs } from '@src/components/common/Tabs';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { useBridgeContext } from '@src/contexts/BridgeProvider';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { Activity } from '@src/pages/Activity/Activity';
import { Collectibles } from '../../../Collectibles/Collectibles';
import { NetworksWidget } from './NetworkWidget/NetworksWidget';
import { WalletBalances } from './WalletBalances';

enum PortfolioTabs {
  ASSETS = 'ASSETS',
  COLLECTIBLES = 'COLLECTIBLES',
  ACTIVITY = 'ACTIVITY',
}

export function Portfolio() {
  const { bridgeTransactions } = useBridgeContext();
  const { capture } = useAnalyticsContext();
  const { network } = useNetworkContext();
  const loading = !network ? true : false;

  return (
    <>
      <VerticalFlex grow="1">
        <WalletBalances />
        <Tabs
          loading={loading}
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
