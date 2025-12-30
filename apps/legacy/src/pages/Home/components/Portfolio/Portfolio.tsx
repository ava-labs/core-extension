import { useAnalyticsContext } from '@core/ui';
import { useFeatureFlagContext } from '@core/ui';
import { DeFi } from '@/pages/DeFi/DeFi';
import { Collectibles } from '../../../Collectibles/Collectibles';
import { NetworksWidget } from './NetworkWidget/NetworksWidget';
import { WalletBalances } from './WalletBalances';
import { useTranslation } from 'react-i18next';
import {
  Box,
  CircularProgress,
  Scrollbars,
  Stack,
  Tab,
  TabPanel,
  Tabs,
  styled,
} from '@avalabs/core-k2-components';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useIsFunctionAvailable } from '@core/ui';
import { Redirect } from 'react-router-dom';
import { usePersistedTabs } from '@core/ui';
import { usePageHistory } from '@core/ui';
import { FAB } from '@/components/common/fab/FAB';
import { FeatureGates } from '@core/types';
import { useSettingsContext } from '@core/ui';
import { Prompt } from './Prompt/Prompt';

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
  const { isReady, checkIsFunctionSupported } = useIsFunctionAvailable({});
  const [listType, setListType] = useState<ListType>();
  const [hadDefiEnabled, setHadDefiEnabled] = useState(false);
  const { getPageHistoryData } = usePageHistory();
  const { coreAssistant } = useSettingsContext();

  const {
    listType: historyListType,
    isLoading: isHistoryLoading,
  }: { listType?: ListType; isLoading: boolean } = getPageHistoryData();
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
    [checkIsFunctionSupported, hadDefiEnabled],
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
    [capture, setActiveTab],
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
        {coreAssistant && featureFlags[FeatureGates.CORE_ASSISTANT] && (
          <Prompt />
        )}
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
                listType ? (
                  <Collectibles
                    listType={listType}
                    setListType={setListType}
                    isHistoryLoading={isHistoryLoading}
                  />
                ) : (
                  <CircularProgress size={60} />
                )
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
