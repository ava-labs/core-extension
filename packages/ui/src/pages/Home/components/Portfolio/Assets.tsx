import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { useTranslation } from 'react-i18next';
import { TokenList } from './TokenList';
import { usePendingBridgeTransactions } from 'packages/ui/pages/Bridge/hooks/usePendingBridgeTransactions';
import {
  AlertTriangleIcon,
  Badge,
  Box,
  ChevronLeftIcon,
  Stack,
  Tab,
  TabPanel,
  Tabs,
  Tooltip,
  Typography,
} from '@avalabs/core-k2-components';
import { Redirect, useHistory } from 'react-router-dom';
import { TokenIcon } from 'packages/ui/src/components/common/TokenIcon';
import {
  getNetworkBalance,
  getNetworkTokensPriceChanges,
} from './NetworkWidget/NetworksWidget';
import { useTokensWithBalances } from '@src/hooks/useTokensWithBalances';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { useMemo, useState } from 'react';
import { WalletRecentTxs } from 'packages/ui/pages/Wallet/WalletRecentTxs';
import { isBitcoinNetwork } from '@core/service-worker';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { useTokenPriceMissing } from '@src/hooks/useTokenPriceIsMissing';
import { PAndL } from 'packages/ui/src/components/common/ProfitAndLoss';
import { useLiveBalance } from '@src/hooks/useLiveBalance';
import { TokenType } from '@avalabs/vm-module-types';

enum AssetsTabs {
  TOKENS,
  ACTIVITY,
}

const POLLED_BALANCES = [TokenType.NATIVE, TokenType.ERC20];

export function Assets() {
  const { t } = useTranslation();
  const { network } = useNetworkContext();
  const bridgeTransactions = usePendingBridgeTransactions();
  const history = useHistory();
  const { currencyFormatter } = useSettingsContext();
  const activeNetworkAssetList = useTokensWithBalances();
  const activeNetworkBalance = getNetworkBalance(activeNetworkAssetList);
  const activeNetworkPriceChanges = getNetworkTokensPriceChanges(
    activeNetworkAssetList,
  );

  const changePercentage =
    (activeNetworkPriceChanges.value / activeNetworkBalance) * 100;

  const { capture } = useAnalyticsContext();
  const { isPriceMissingFromNetwork } = useTokenPriceMissing();

  const [activeTab, setActiveTab] = useState<number>(AssetsTabs.TOKENS);

  function handleChange(_: React.SyntheticEvent, newValue: number) {
    setActiveTab(newValue);
    if (newValue === AssetsTabs.TOKENS) {
      capture('AssetsPageAssetsClicked');
    } else if (newValue === AssetsTabs.ACTIVITY) {
      capture('AssetsPageActivityClicked');
    }
  }

  const missingSomeTokenPrices = useMemo(() => {
    if (!network?.chainId) {
      return;
    }
    return isPriceMissingFromNetwork(network?.chainId);
  }, [isPriceMissingFromNetwork, network]);

  useLiveBalance(POLLED_BALANCES);

  return (
    <Stack sx={{ flexGrow: 1 }}>
      <Stack
        direction="row"
        sx={{
          alignItems: 'center',
          justifyContent: 'flex-start',
          width: '100%',
          mt: 2,
          py: '12px',
          px: 2,
        }}
      >
        <Stack direction="row" alignItems="flex-start">
          <ChevronLeftIcon
            onClick={() => history.push('/home')}
            size={30}
            sx={{ cursor: 'pointer', mr: 1 }}
          />
          <Stack>
            <Stack
              sx={{
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <TokenIcon
                width="24px"
                height="24px"
                src={network?.logoUri}
                name={network?.chainName}
              />
              <Typography variant="h5" sx={{ ml: 1 }}>
                {network?.chainName}
              </Typography>
            </Stack>

            <Stack sx={{ flexDirection: 'row', alignItems: 'center' }}>
              {missingSomeTokenPrices && (
                <Tooltip
                  title={t(
                    'The prices of some tokens are missing. The balance might not be accurate currently.',
                  )}
                  placement="bottom"
                >
                  <AlertTriangleIcon
                    size={16}
                    sx={{ color: 'warning.main', mr: 1 }}
                  />
                </Tooltip>
              )}
              <Typography variant="h4">
                {currencyFormatter(activeNetworkBalance)}
              </Typography>
            </Stack>
            <PAndL
              value={activeNetworkPriceChanges.value}
              percentage={changePercentage}
              showPercentage
            />
          </Stack>
        </Stack>
      </Stack>
      <Stack sx={{ flexGrow: 1 }}>
        <Box sx={{ mx: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            onChange={handleChange}
            value={activeTab}
            size="medium"
            variant="fullWidth"
          >
            <Tab value={AssetsTabs.TOKENS} label={t('Tokens')} />
            <Tab
              value={AssetsTabs.ACTIVITY}
              label={
                <Badge
                  badgeContent={Object.values(bridgeTransactions).length}
                  color="secondary"
                >
                  {t('Activity')}
                </Badge>
              }
            />
          </Tabs>
        </Box>
        <Stack sx={{ flexGrow: 1 }}>
          <TabPanel
            value={activeTab}
            index={AssetsTabs.TOKENS}
            sx={{
              flexGrow: activeTab === AssetsTabs.TOKENS ? 1 : 0,
              display: 'flex',
            }}
          >
            {network && isBitcoinNetwork(network) ? (
              <Redirect to={'/token'} />
            ) : (
              <TokenList />
            )}
          </TabPanel>
          <TabPanel
            value={activeTab}
            index={AssetsTabs.ACTIVITY}
            sx={{ flexGrow: activeTab === AssetsTabs.ACTIVITY ? 1 : 0, my: 2 }}
          >
            {network && isBitcoinNetwork(network) ? (
              <Redirect to={'/token'} />
            ) : (
              <WalletRecentTxs />
            )}
          </TabPanel>
        </Stack>
      </Stack>
    </Stack>
  );
}

export default Assets;
