import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { useTranslation } from 'react-i18next';
import { TokenList } from './TokenList';
import { useBridgeContext } from '@src/contexts/BridgeProvider';
import {
  Badge,
  Box,
  ChevronLeftIcon,
  Stack,
  Tab,
  TabPanel,
  Tabs,
  Typography,
  styled,
} from '@avalabs/k2-components';
import { Redirect, useHistory } from 'react-router-dom';
import { TokenIcon } from '@src/components/common/TokenIcon';
import { getNetworkBalance } from './NetworkWidget/NetworksWidget';
import { useTokensWithBalances } from '@src/hooks/useTokensWithBalances';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { useState } from 'react';
import { WalletRecentTxs } from '@src/pages/Wallet/WalletRecentTxs';
import { isBitcoinNetwork } from '@src/background/services/network/utils/isBitcoinNetwork';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';

const LogoContainer = styled('div')`
  margin: 0 15px 0 8px;
`;

enum AssetsTabs {
  TOKENS,
  ACTIVITY,
}

export function Assets() {
  const { t } = useTranslation();
  const { network } = useNetworkContext();
  const { bridgeTransactions } = useBridgeContext();
  const history = useHistory();
  const { currencyFormatter } = useSettingsContext();
  const activeNetworkAssetList = useTokensWithBalances();
  const activeNetworkBalance = getNetworkBalance(activeNetworkAssetList);
  const { capture } = useAnalyticsContext();

  const [activeTab, setActiveTab] = useState<number>(AssetsTabs.TOKENS);

  function handleChange(event: React.SyntheticEvent, newValue: number) {
    setActiveTab(newValue);
    if (newValue === AssetsTabs.TOKENS) {
      capture('AssetsPageAssetsClicked');
    } else if (newValue === AssetsTabs.ACTIVITY) {
      capture('AssetsPageActivityClicked');
    }
  }

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
        <Stack direction="row" alignItems="center">
          <ChevronLeftIcon
            onClick={() => history.push('/home')}
            size={30}
            sx={{ cursor: 'pointer' }}
          />
          <LogoContainer>
            <TokenIcon
              width="40px"
              height="40px"
              src={network?.logoUri}
              name={network?.chainName}
            />
          </LogoContainer>
          <Stack>
            <Typography variant="h4">{network?.chainName}</Typography>
            <Typography variant="body1">
              {currencyFormatter(activeNetworkBalance)}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
      <Box>
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
        <Box sx={{ height: 370 }}>
          <TabPanel
            value={activeTab}
            index={AssetsTabs.TOKENS}
            sx={{ height: '100%' }}
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
            sx={{ height: 360, my: 2 }}
          >
            {network && isBitcoinNetwork(network) ? (
              <Redirect to={'/token'} />
            ) : (
              <WalletRecentTxs />
            )}
          </TabPanel>
        </Box>
      </Box>
    </Stack>
  );
}

export default Assets;
