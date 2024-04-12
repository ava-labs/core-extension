import { Assetlist } from './Assetlist';
import { NetworkCard } from './common/NetworkCard';
import { useHistory } from 'react-router-dom';
import { ZeroWidget } from './ZeroWidget';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { TokenWithBalance } from '@src/background/services/balances/models';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { Trans, useTranslation } from 'react-i18next';
import { useBalancesContext } from '@src/contexts/BalancesProvider';
import {
  BridgeIcon,
  Button,
  Chip,
  Divider,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
  AlertTriangleIcon,
  Badge,
  CheckIcon,
} from '@avalabs/k2-components';
import { TokenIcon } from '@src/components/common/TokenIcon';
import { NetworkLogoK2 } from '@src/components/common/NetworkLogoK2';
import { isBitcoin } from '@src/utils/isBitcoin';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { usePendingBridgeTransactions } from '@src/pages/Bridge/hooks/usePendingBridgeTransactions';
import { isBitcoinNetwork } from '@src/background/services/network/utils/isBitcoinNetwork';
import { BN } from 'bn.js';
import { PAndL } from '@src/components/common/ProfitAndLoss';

interface ActiveNetworkWidgetProps {
  assetList: TokenWithBalance[];
  activeNetworkBalance: number;
  activeNetworkPriceChanges?: { value: number; percentage: number[] };
}

export function ActiveNetworkWidget({
  assetList,
  activeNetworkBalance,
  activeNetworkPriceChanges,
}: ActiveNetworkWidgetProps) {
  const { t } = useTranslation();
  const history = useHistory();
  const { network, isCustomNetwork } = useNetworkContext();

  const { currencyFormatter } = useSettingsContext();
  const { isTokensCached } = useBalancesContext();
  const { capture } = useAnalyticsContext();

  const bridgeTransactions = usePendingBridgeTransactions();
  const changePercentage = activeNetworkPriceChanges
    ? (activeNetworkPriceChanges?.value / activeNetworkBalance) * 100
    : undefined;

  if (!network || !assetList?.length) {
    return <Skeleton variant="rounded" sx={{ width: 343, height: 190 }} />;
  }

  const handleCardClick = (e) => {
    e.stopPropagation();
    capture('PortfolioPrimaryNetworkClicked', { chainId: network.chainId });

    if (isBitcoinNetwork(network)) {
      history.push('/token');
    } else {
      history.push('/assets');
    }
  };

  const hasNoFunds =
    assetList.length === 1 && assetList[0]?.balance.eq(new BN(0));

  return (
    <>
      <NetworkCard
        data-testid="active-network-card"
        display="block"
        onClick={handleCardClick}
      >
        <Stack sx={{ height: '100%', rowGap: 1 }}>
          <Stack
            direction="row"
            sx={{ justifyContent: 'space-between', width: '100%' }}
          >
            <Badge
              badgeContent={
                Object.values(bridgeTransactions).length ? (
                  <Tooltip
                    title={
                      <Trans i18nKey="Bridge in progress. <br/> Click for details." />
                    }
                    sx={{ cursor: 'pointer' }}
                  >
                    <>{Object.values(bridgeTransactions).length}</>
                  </Tooltip>
                ) : null
              }
              color="secondary"
            >
              <TokenIcon
                width="40px"
                height="40px"
                src={network.logoUri}
                name={network.chainName}
              >
                <NetworkLogoK2 height="40px" src={network.logoUri} />
              </TokenIcon>
            </Badge>
            <Chip
              label={t('Active')}
              size="small"
              sx={{
                height: '20px',
                cursor: 'pointer',
                color: 'success.main',
              }}
              icon={<CheckIcon color="success.main" />}
            />
          </Stack>
          <Stack justifyContent="center" sx={{ rowGap: 0.5 }}>
            <Stack
              sx={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography
                data-testid="active-network-name"
                variant="h5"
                sx={{ color: 'grey.300' }}
              >
                {network?.chainName}
              </Typography>
              <Stack sx={{ textAlign: 'end' }}>
                <Typography
                  data-testid="active-network-total-balance"
                  variant="h6"
                >
                  {currencyFormatter(activeNetworkBalance)}
                </Typography>

                {!isCustomNetwork(network.chainId) && (
                  <Stack
                    sx={{
                      flexDirection: 'row',
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                    }}
                  >
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

                    <PAndL
                      value={activeNetworkPriceChanges?.value}
                      percentage={changePercentage}
                      size="big"
                    />
                  </Stack>
                )}
              </Stack>
            </Stack>
          </Stack>
        </Stack>
        <Divider
          sx={{
            my: 2,
            width: 'auto',
          }}
        />
        <Assetlist assetList={assetList} />

        {hasNoFunds && !isBitcoin(network) ? <ZeroWidget /> : null}

        {isBitcoin(network) ? (
          <Button
            data-testid="btc-bridge-button"
            color="secondary"
            fullWidth
            sx={{
              mt: 2,
            }}
            onClick={(e: MouseEvent) => {
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
