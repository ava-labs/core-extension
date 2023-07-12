import { FeatureGates } from '@avalabs/posthog-sdk';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { useFeatureFlagContext } from '@src/contexts/FeatureFlagsProvider';
import { DeFi } from '@src/pages/DeFi/DeFi';
import { Collectibles } from '../../../Collectibles/Collectibles';
import { NetworksWidget } from './NetworkWidget/NetworksWidget';
import { WalletBalances } from './WalletBalances';
import { useTranslation } from 'react-i18next';
import { Box, Stack, Tab, TabPanel, Tabs } from '@avalabs/k2-components';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useIsFunctionAvailable } from '@src/hooks/useIsFunctionUnavailable';
import { Redirect } from 'react-router-dom';
import { usePersistedTabs } from '@src/hooks/usePersistedTabs';

export enum PortfolioTabs {
  ASSETS,
  COLLECTIBLES,
  DEFI,
}

const functionIds = {
  [PortfolioTabs.ASSETS]: 'ASSETS',
  [PortfolioTabs.COLLECTIBLES]: 'COLLECTIBLES',
  [PortfolioTabs.DEFI]: 'DEFI',
};

export function Portfolio() {
  const { t } = useTranslation();
  const { capture } = useAnalyticsContext();
  const { featureFlags } = useFeatureFlagContext();
  const { activeTab, setActiveTab } = usePersistedTabs(PortfolioTabs.ASSETS);
  const { isReady, checkIsFunctionAvailable } = useIsFunctionAvailable();
  const [hadDefiEnabled, setHadDefiEnabled] = useState(false);

  useEffect(() => {
    if (featureFlags[FeatureGates.DEFI]) {
      // Never set it back to false,
      // we need to know if it was *ever* enabled in the current UI session.
      setHadDefiEnabled(true);
    }
  }, [featureFlags]);

  const shouldShow = useCallback(
    (tab) => {
      if (tab === PortfolioTabs.DEFI && !hadDefiEnabled) {
        return false;
      }

      const idToCheck = functionIds[tab];

      if (!idToCheck) {
        return false;
      }

      return checkIsFunctionAvailable(idToCheck);
    },
    [checkIsFunctionAvailable, hadDefiEnabled]
  );

  const handleChange = useCallback(
    (event: React.SyntheticEvent, newValue: number) => {
      setActiveTab(newValue);
      if (newValue === PortfolioTabs.ASSETS) {
        capture('PortfolioAssetsClicked');
      } else if (newValue === PortfolioTabs.COLLECTIBLES) {
        capture('PortfolioCollectiblesClicked');
      } else if (newValue === PortfolioTabs.DEFI) {
        capture('PortfolioDefiClicked');
      }
    },
    [capture, setActiveTab]
  );

  const tabs = useMemo(() => {
    const tabsToShow = Object.values(PortfolioTabs)
      .filter((tab) => shouldShow(tab))
      .map((tab) => {
        const label =
          tab === PortfolioTabs.ASSETS
            ? t('Assets')
            : tab === PortfolioTabs.COLLECTIBLES
            ? t('Collectibles')
            : tab === PortfolioTabs.DEFI
            ? t('DeFi')
            : null;
        return {
          label,
          tab,
        };
      });

    return (
      <Tabs
        onChange={handleChange}
        value={activeTab}
        size="medium"
        variant="fullWidth"
      >
        {tabsToShow.map(({ label, tab }) => {
          return label ? (
            <Tab label={label} value={tab} key={`portfolio-tab-${tab}`} />
          ) : null;
        })}
      </Tabs>
    );
  }, [activeTab, handleChange, shouldShow, t]);

  return (
    <Stack>
      <WalletBalances />
      <Box>
        <Box sx={{ mx: 2, mt: 1 }}>{tabs}</Box>
        <Box sx={{ height: 420 }}>
          <TabPanel
            value={activeTab}
            index={PortfolioTabs.ASSETS}
            sx={{ height: '100%' }}
          >
            <NetworksWidget />
          </TabPanel>

          <TabPanel
            value={activeTab}
            index={PortfolioTabs.COLLECTIBLES}
            sx={{ height: '100%' }}
          >
            {shouldShow(PortfolioTabs.COLLECTIBLES) ? (
              <Collectibles />
            ) : (
              isReady && ( // Only redirect when we have all the context needed to decide
                <Redirect to={'/'} />
              )
            )}
          </TabPanel>

          <TabPanel
            value={activeTab}
            index={PortfolioTabs.DEFI}
            sx={{ height: '100%' }}
          >
            <DeFi />
          </TabPanel>
        </Box>
      </Box>
    </Stack>
  );
}
