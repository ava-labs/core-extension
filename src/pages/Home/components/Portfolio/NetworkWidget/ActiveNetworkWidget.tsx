import { Assetlist } from './Assetlist';
import { NetworkCard } from './common/NetworkCard';
import { useHistory } from 'react-router-dom';
import { ZeroWidget } from './ZeroWidget';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { TokenWithBalance } from '@src/background/services/balances/models';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { Trans, useTranslation } from 'react-i18next';
import { getCoreWebUrl } from '@src/utils/getCoreWebUrl';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { ChainId } from '@avalabs/chains-sdk';
import { useBalancesContext } from '@src/contexts/BalancesProvider';
import {
  BridgeIcon,
  Button,
  Chip,
  Divider,
  ExternalLinkIcon,
  IconButton,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
  styled,
  AlertTriangleIcon,
  Badge,
} from '@avalabs/k2-components';
import { TokenIconK2 } from '@src/components/common/TokenImageK2';
import { NetworkLogoK2 } from '@src/components/common/NetworkLogoK2';
import { openNewTab } from '@src/utils/extensionUtils';
import { isBitcoin } from '@src/utils/isBitcoin';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { useBridgeContext } from '@src/contexts/BridgeProvider';
import { isBitcoinNetwork } from '@src/background/services/network/utils/isBitcoinNetwork';

interface ActiveNetworkWidgetProps {
  assetList: TokenWithBalance[];
  activeNetworkBalance: number;
}

const LogoContainer = styled('div')`
  margin-top: 4px;
  margin-right: 16px;
`;

export function ActiveNetworkWidget({
  assetList,
  activeNetworkBalance,
}: ActiveNetworkWidgetProps) {
  const { t } = useTranslation();
  const history = useHistory();
  const { network, isCustomNetwork } = useNetworkContext();

  const { currencyFormatter } = useSettingsContext();
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();
  const { isTokensCached } = useBalancesContext();
  const { capture } = useAnalyticsContext();
  const { bridgeTransactions } = useBridgeContext();

  if (!network || !assetList?.length) {
    return <Skeleton variant="rounded" sx={{ width: 343, height: 190 }} />;
  }

  const showCoreWebLink =
    network.chainId === ChainId.BITCOIN || isCustomNetwork(network.chainId)
      ? false
      : true;

  const handleCardClick = (e) => {
    e.stopPropagation();
    capture('PortfolioPrimaryNetworkClicked', { chainId: network.chainId });

    if (isBitcoinNetwork(network)) {
      history.push('/token');
    } else {
      history.push('/assets');
    }
  };

  return (
    <>
      <NetworkCard
        data-testid="active-network-card"
        display="block"
        onClick={handleCardClick}
      >
        <Stack sx={{ height: '100%' }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="stretch"
            sx={{
              width: '100%',
              height: '100%',
            }}
          >
            <Stack direction="row">
              <LogoContainer>
                <Badge
                  badgeContent={
                    Object.values(bridgeTransactions).length ? (
                      <Tooltip
                        title={
                          <Trans i18nKey="Bridge in progress. <br/> Click for details." />
                        }
                        sx={{ cursor: 'pointer' }}
                      >
                        {Object.values(bridgeTransactions).length}
                      </Tooltip>
                    ) : null
                  }
                  color="secondary"
                >
                  <TokenIconK2
                    width="40px"
                    height="40px"
                    src={network.logoUri}
                    name={network.chainName}
                  >
                    <NetworkLogoK2 height="40px" src={network.logoUri} />
                  </TokenIconK2>
                </Badge>
              </LogoContainer>
              <Stack justifyContent="center" sx={{ rowGap: 0.5 }}>
                <Typography data-testid="active-network-name" variant="h6">
                  {network?.chainName}
                </Typography>
                {!isCustomNetwork(network.chainId) && (
                  <Stack sx={{ flexDirection: 'row', alignItems: 'center' }}>
                    {isTokensCached && (
                      <Tooltip
                        title={t('Balances loading...')}
                        placement="bottom"
                      >
                        <AlertTriangleIcon
                          size={14}
                          sx={{ color: 'warning.main', mr: 1 }}
                        />
                      </Tooltip>
                    )}
                    <Typography
                      data-testid="active-network-total-balance"
                      variant="h6"
                    >
                      {currencyFormatter(activeNetworkBalance)}
                    </Typography>
                  </Stack>
                )}
              </Stack>
            </Stack>
            <Stack alignItems="flex-end" sx={{ rowGap: 1, width: '70px' }}>
              <Chip
                label={t('Active')}
                size="small"
                color="primary"
                sx={{
                  height: '20px',
                  cursor: 'pointer',
                }}
              />
              {showCoreWebLink ? (
                <Tooltip placement="left" title={t('View in Core Web')}>
                  <IconButton
                    data-testid="core-web-link-icon"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();

                      const url = getCoreWebUrl(
                        activeAccount?.addressC,
                        network.chainId
                      );

                      if (url) {
                        openNewTab({
                          url,
                        });
                      }
                    }}
                  >
                    <ExternalLinkIcon />
                  </IconButton>
                </Tooltip>
              ) : null}
            </Stack>
          </Stack>
        </Stack>
        {assetList.length ? (
          <>
            <Divider
              sx={{
                my: 2,
                width: 'auto',
              }}
            />
            <Assetlist assetList={assetList} />
          </>
        ) : (
          <ZeroWidget />
        )}
        {isBitcoin(network) ? (
          <Button
            data-testid="btc-bridge-button"
            color="secondary"
            fullWidth
            sx={{
              mt: 2,
            }}
            onClick={(e) => {
              e.stopPropagation();
              history.push('/bridge');
            }}
          >
            <BridgeIcon
              sx={{
                mr: 1,
              }}
            />
            {t('Bridge')}
          </Button>
        ) : null}
      </NetworkCard>
    </>
  );
}
