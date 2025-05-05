import { NetworkLogoK2 } from '@/components/common/NetworkLogoK2';
import { PAndL } from '@/components/common/ProfitAndLoss';
import { TokenIcon } from '@/components/common/TokenIcon';
import { useAnalyticsContext } from '@/contexts/AnalyticsProvider';
import { useBalancesContext } from '@/contexts/BalancesProvider';
import { useNetworkContext } from '@/contexts/NetworkProvider';
import { useSettingsContext } from '@/contexts/SettingsProvider';
import { usePendingBridgeTransactions } from '@/pages/Bridge/hooks/usePendingBridgeTransactions';
import {
  AlertTriangleIcon,
  Badge,
  BridgeIcon,
  Button,
  CheckIcon,
  Chip,
  Divider,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from '@avalabs/core-k2-components';
import { TokenWithBalance } from '@avalabs/vm-module-types';
import {
  isBitcoin,
  isBitcoinNetwork,
  isPchainNetwork,
  isTokenWithBalanceAVM,
  isTokenWithBalancePVM,
  isXchainNetwork,
  normalizeBalance,
} from '@core/common';
import Big from 'big.js';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Assetlist } from './Assetlist';
import { NetworkCard } from './common/NetworkCard';
import { PchainActiveNetworkWidgetContent } from './PchainActiveNetworkWidgetContent';
import { XchainActiveNetworkWidgetContent } from './XchainActiveNetworkWidgetContent';
import { ZeroWidget } from './ZeroWidget';

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

    if (
      isBitcoinNetwork(network) ||
      isPchainNetwork(network) ||
      isXchainNetwork(network)
    ) {
      history.push('/token');
    } else {
      history.push('/assets');
    }
  };

  const firstAsset = assetList[0];
  const funds =
    firstAsset && 'decimals' in firstAsset
      ? (normalizeBalance(firstAsset.balance, firstAsset.decimals) ??
        new Big(0))
      : new Big(0);
  const hasNoFunds = assetList.length === 1 && funds?.eq(new Big(0));

  const selectedAssetList = assetList[0];

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
        {isPchainNetwork(network) &&
        isTokenWithBalancePVM(selectedAssetList) ? (
          <PchainActiveNetworkWidgetContent balances={selectedAssetList} />
        ) : isXchainNetwork(network) &&
          isTokenWithBalanceAVM(selectedAssetList) ? (
          <XchainActiveNetworkWidgetContent balances={selectedAssetList} />
        ) : (
          <Assetlist assetList={assetList} />
        )}

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
