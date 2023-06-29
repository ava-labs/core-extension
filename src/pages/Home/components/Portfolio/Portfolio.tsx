import { useEffect, useMemo, useState } from 'react';
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
  const [hadDefiEnabled, setHadDefiEnabled] = useState(false);

  useEffect(() => {
    if (featureFlags[FeatureGates.DEFI]) {
      setHadDefiEnabled(true);
    }
  }, [featureFlags]);

  const tabs = useMemo(
    () => [
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
      // If user is on DeFi tab and we disable the feature flag, we want
      // the tab to stay opened, so we can't just remove it from the array here.
      // Instead, the <DeFi /> component will render the message about
      // DeFi not being available.
      ...(hadDefiEnabled
        ? [
            {
              title: t('DeFi'),
              id: PortfolioTabs.DEFI,
              component: <DeFi />,
              onClick: () => capture('PortfolioDefiClicked'),
            },
          ]
        : []),
    ],
    [capture, bridgeTransactions, t, hadDefiEnabled]
  );

  return (
    <>
      <Stack sx={{ flexGrow: 1 }}>
        <WalletBalances />
        <Tabs loading={loading} margin="14px 0 0" tabs={tabs} />
      </Stack>
    </>
  );
}
