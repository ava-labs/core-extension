import { FeatureGates } from '@avalabs/posthog-sdk';

import { Tabs } from '@src/components/common/Tabs';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { useFeatureFlagContext } from '@src/contexts/FeatureFlagsProvider';
import { useBridgeContext } from '@src/contexts/BridgeProvider';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { Activity } from '@src/pages/Activity/Activity';
import { DeFi } from '@src/pages/DeFi/DeFi';
import { Collectibles } from '../../../Collectibles/Collectibles';
import { NetworksWidget } from './NetworkWidget/NetworksWidget';
import { WalletBalances } from './WalletBalances';
import { useTranslation } from 'react-i18next';
import { Stack } from '@avalabs/k2-components';

export enum PortfolioTabs {
  ASSETS = 'ASSETS',
  COLLECTIBLES = 'COLLECTIBLES',
  ACTIVITY = 'ACTIVITY',
  DEFI = 'DEFI',
}

export function Portfolio() {
  const { t } = useTranslation();
  const { bridgeTransactions } = useBridgeContext();
  const { capture } = useAnalyticsContext();
  const { network } = useNetworkContext();
  const { featureFlags } = useFeatureFlagContext();
  const loading = !network ? true : false;

  return (
    <>
      <Stack sx={{ flexGrow: 1 }}>
        <WalletBalances />
        <Tabs
          loading={loading}
          margin="14px 0 0"
          tabs={[
            {
              title: t('Assets'),
              id: PortfolioTabs.ASSETS,
              component: <NetworksWidget />,
              onClick: () => capture('PortfolioAssetsClicked'),
            },
            {
              title: t('Collectibles'),
              id: PortfolioTabs.COLLECTIBLES,
              component: <Collectibles />,
              onClick: () => capture('PortfolioCollectiblesClicked'),
            },
            {
              title: t('Activity'),
              id: PortfolioTabs.ACTIVITY,
              component: <Activity />,
              badgeAmount:
                bridgeTransactions && Object.values(bridgeTransactions).length,
              onClick: () => capture('PortfolioActivityClicked'),
            },
            ...(featureFlags[FeatureGates.DEFI]
              ? [
                  {
                    title: t('DeFi'),
                    id: PortfolioTabs.DEFI,
                    component: <DeFi />,
                    onClick: () => capture('PortfolioDefiClicked'),
                  },
                ]
              : []),
          ]}
        />
      </Stack>
    </>
  );
}
