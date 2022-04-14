import { LoadingSpinnerIcon, VerticalFlex } from '@avalabs/react-components';
import { Tabs } from '@src/components/common/Tabs';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { useBridgeContext } from '@src/contexts/BridgeProvider';
import { useWalletContext } from '@src/contexts/WalletProvider';
import { Activity } from '@src/pages/Activity/Activity';
import { useTheme } from 'styled-components';
import { Collectibles } from '../../../Collectibles/Collectibles';
import { TokenList } from './TokenList';
import { WalletBalances } from './WalletBalances';

enum PortfolioTabs {
  ASSETS = 'ASSETS',
  COLLECTIBLES = 'COLLECTIBLES',
  ACTIVITY = 'ACTIVITY',
}

export function Portfolio() {
  const theme = useTheme();
  const { isBalanceLoading, isWalletReady } = useWalletContext();
  const { bridgeTransactions } = useBridgeContext();
  const { capture } = useAnalyticsContext();

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
