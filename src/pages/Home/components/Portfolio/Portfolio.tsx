import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { useFeatureFlagContext } from '@src/contexts/FeatureFlagsProvider';
import { DeFi } from '@src/pages/DeFi/DeFi';
import { Collectibles } from '../../../Collectibles/Collectibles';
import { NetworksWidget } from './NetworkWidget/NetworksWidget';
import { WalletBalances } from './WalletBalances';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Scrollbars,
  Stack,
  Tab,
  TabPanel,
  Tabs,
  styled,
} from '@avalabs/k2-components';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useIsFunctionAvailable } from '@src/hooks/useIsFunctionAvailable';
import { Redirect } from 'react-router-dom';
import { usePersistedTabs } from '@src/hooks/usePersistedTabs';
import { usePageHistory } from '@src/hooks/usePageHistory';
import { FAB } from '@src/components/common/fab/FAB';
import { FeatureGates } from '@src/background/services/featureFlags/models';

export enum PortfolioTabs {
  ASSETS,
  COLLECTIBLES,
  DEFI,
}

export enum ListType {
  GRID = 'GRID',
  LIST = 'LIST',
}

const functionIds = {
  [PortfolioTabs.ASSETS]: 'ASSETS',
  [PortfolioTabs.COLLECTIBLES]: 'COLLECTIBLES',
  [PortfolioTabs.DEFI]: 'DEFI',
};

const FlexScrollbars = styled(Scrollbars)`
  flex-grow: 1;
  max-height: unset;
  height: 100%;
  width: 100%;

  & > div {
    display: flex;
    flex-direction: column;
  }
`;

export function Portfolio() {
  const { t } = useTranslation();
  const { capture } = useAnalyticsContext();
  const { featureFlags } = useFeatureFlagContext();
  const { activeTab, setActiveTab } = usePersistedTabs(PortfolioTabs.ASSETS);
  const { isReady, checkIsFunctionSupported } = useIsFunctionAvailable();
  const [listType, setListType] = useState(ListType.GRID);
  const [hadDefiEnabled, setHadDefiEnabled] = useState(false);
  const { getPageHistoryData, isHistoryLoading } = usePageHistory();

  const { listType: historyListType }: { listType?: ListType } =
    getPageHistoryData();
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    if (featureFlags[FeatureGates.DEFI]) {
      // Never set it back to false,
      // we need to know if it was *ever* enabled in the current UI session.
      setHadDefiEnabled(true);
    }
  }, [featureFlags]);

  useEffect(() => {
    if (isHistoryLoading) {
      return;
    }
    if (historyListType) {
      setListType(historyListType);
      return;
    }
    setListType(ListType.GRID);
  }, [historyListType, isHistoryLoading, setListType]);

  const shouldShow = useCallback(
    (tab) => {
      if (tab === PortfolioTabs.DEFI && !hadDefiEnabled) {
        return false;
      }

      const idToCheck = functionIds[tab];

      if (!idToCheck) {
        return false;
      }

      return checkIsFunctionSupported(idToCheck);
    },
    [checkIsFunctionSupported, hadDefiEnabled]
  );

  const handleChange = useCallback(
    (_event: React.SyntheticEvent, newValue: number) => {
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
    <Stack sx={{ flexGrow: 1 }}>
      <WalletBalances />
      <FAB isContentScrolling={isScrolling} />
      <Stack sx={{ flexGrow: 1 }}>
        <Box sx={{ mx: 2, mt: 1, borderBottom: 1, borderColor: 'divider' }}>
          {tabs}
        </Box>
        <Stack sx={{ flexGrow: 1 }}>
          <FlexScrollbars
            onScrollStart={() => setIsScrolling(true)}
            onScrollStop={() => setIsScrolling(false)}
          >
            <TabPanel
              value={activeTab}
              index={PortfolioTabs.ASSETS}
              sx={{ height: '100%', pb: 3 }}
            >
              <NetworksWidget />
            </TabPanel>

            <TabPanel
              value={activeTab}
              index={PortfolioTabs.COLLECTIBLES}
              sx={{ height: '100%' }}
            >
              {shouldShow(PortfolioTabs.COLLECTIBLES) ? (
                <Collectibles listType={listType} setListType={setListType} />
              ) : (
                isReady && ( // Only redirect when we have all the context needed to decide
                  <Redirect to={'/'} />
                )
              )}
            </TabPanel>

            <TabPanel
              value={activeTab}
              index={PortfolioTabs.DEFI}
              sx={{ height: '100%', pb: 3 }}
            >
              <DeFi />
            </TabPanel>
          </FlexScrollbars>
        </Stack>
      </Stack>
    </Stack>
  );
}
