import { OptimalRate } from 'paraswap-core';
import { SwapRefreshTimer } from '../SwapRefreshTimer';
import { ReviewLoading } from './ReviewLoading';
import { useLedgerDisconnectedDialog } from '@src/pages/SignTransaction/hooks/useLedgerDisconnectedDialog';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { PageTitle } from '@src/components/common/PageTitle';
import { TokenWithBalance } from '@src/background/services/balances/models';
import { bnToLocaleString } from '@avalabs/utils-sdk';
import { BN } from 'bn.js';
import { useTranslation } from 'react-i18next';
import {
  Stack,
  Typography,
  useTheme,
  styled,
  Button,
  Divider,
  Card,
  CardContent,
} from '@avalabs/k2-components';
import { Overlay } from '@src/components/common/Overlay';
import { TokenAmount } from '@src/components/common/TokenAmount';
import {
  GasFeeModifier,
  getUpToTwoDecimals,
  getGasFeeToDisplay,
} from '@src/components/common/CustomFees';
import { useNetworkFeeContext } from '@src/contexts/NetworkFeeProvider';

export interface ReviewOrderProps {
  fromToken: TokenWithBalance;
  toToken: TokenWithBalance;
  onClose: () => void;
  onConfirm: () => void;
  optimalRate: OptimalRate;
  gasPrice: bigint;
  slippage: string;
  onTimerExpire: () => void;
  isLoading: boolean;
  rateValueInput: 'from' | 'to' | '';
  rate: number;
  selectedGasFee: GasFeeModifier;
}

const DetailsRow = styled(Stack)`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  margin: 8px 0;
  align-items: center;
`;

const DetailLabel = styled(Typography)`
  color: ${({ theme }) => theme.palette.grey[400]};
`;

const useGasFeeModifierTranslation = (modifier: GasFeeModifier) => {
  const { t } = useTranslation();
  switch (modifier) {
    case GasFeeModifier.CUSTOM:
      return t('Custom');
    case GasFeeModifier.FAST:
      return t('Fast');
    case GasFeeModifier.INSTANT:
      return t('Instant');
    default:
      return t('Normal');
  }
};

export function ReviewOrder({
  fromToken,
  toToken,
  onClose,
  onConfirm,
  optimalRate,
  gasPrice,
  slippage,
  onTimerExpire,
  isLoading,
  rate,
  selectedGasFee,
}: ReviewOrderProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const { currencyFormatter } = useSettingsContext();
  const { networkFee } = useNetworkFeeContext();
  useLedgerDisconnectedDialog(onClose);
  const GasFeeModifierTranslation =
    useGasFeeModifierTranslation(selectedGasFee);

  return (
    <Overlay
      isBackgroundFilled
      sx={{ flexDirection: 'column', pt: 1, px: 0, pb: 3 }}
    >
      <Stack
        sx={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '100%',
          alignItems: 'center',
          py: 0,
          pr: 2,
          pb: 0,
        }}
      >
        <PageTitle onBackClick={onClose}>{t('Review Order')}</PageTitle>
        {onTimerExpire && (
          <SwapRefreshTimer secondsTimer={59} onExpire={onTimerExpire} />
        )}
      </Stack>

      {isLoading && (
        <Stack sx={{ width: '100%', flexGrow: 1 }}>
          <ReviewLoading />
        </Stack>
      )}
      {!isLoading && (
        <Stack
          sx={{
            py: 0,
            px: 2,
            flexGrow: 1,
            width: '100%',
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontWeight: theme.typography.fontWeightSemibold,
              mt: 1,
              mb: 0.75,
            }}
          >
            {t('From')}
          </Typography>
          <Card>
            <CardContent sx={{ p: 2 }}>
              <TokenAmount
                token={fromToken}
                amount={bnToLocaleString(
                  new BN(optimalRate?.srcAmount || '0'),
                  optimalRate?.srcDecimals
                )}
                fiatValue={currencyFormatter(Number(optimalRate?.srcUSD))}
              />
            </CardContent>
          </Card>

          <Typography
            variant="body2"
            sx={{
              fontWeight: theme.typography.fontWeightSemibold,
              mt: 2,
              mb: 0.75,
            }}
          >
            {t('To')}
          </Typography>
          <Card>
            <CardContent sx={{ p: 2 }}>
              <TokenAmount
                token={toToken}
                amount={bnToLocaleString(
                  new BN(optimalRate?.destAmount || '0'),
                  optimalRate?.destDecimals
                )}
                fiatValue={currencyFormatter(Number(optimalRate?.destUSD))}
              />
            </CardContent>
          </Card>
          <Divider sx={{ my: 2, mx: 0 }} />
          <Stack sx={{ flexGrow: 1, width: '100%' }}>
            <Typography
              variant="body2"
              sx={{ fontWeight: theme.typography.fontWeightSemibold, mb: 1 }}
            >
              {t('Details')}
            </Typography>
            <DetailsRow>
              <DetailLabel variant="body2">{t('Rate')}</DetailLabel>
              <Typography variant="body2">
                1 {fromToken?.symbol} ≈ {rate?.toFixed(4)} {toToken?.symbol}
              </Typography>
            </DetailsRow>
            <DetailsRow data-testid="swap-review-slippage">
              <DetailLabel variant="body2">
                {t('Slippage tolerance')}
              </DetailLabel>
              <Typography variant="body2">{slippage || 0}%</Typography>
            </DetailsRow>
            <DetailsRow data-testid="swap-review-network-fee">
              <DetailLabel variant="body2">{t('Network Fee')}</DetailLabel>
              <Typography variant="body2">
                {GasFeeModifierTranslation} (
                {networkFee &&
                  getGasFeeToDisplay(
                    getUpToTwoDecimals(gasPrice, networkFee.displayDecimals),
                    networkFee
                  )}
                )
              </Typography>
            </DetailsRow>
          </Stack>
          <Stack
            sx={{
              flexDirection: 'row',
              flexGrow: '1',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              width: '100%',
              gap: 1,
            }}
          >
            <Button
              data-testid="swap-cancel-button"
              onClick={onClose}
              size="large"
              color="secondary"
              fullWidth
            >
              {t('Cancel')}
            </Button>
            <Button
              data-testid="swap-now-button"
              size="large"
              onClick={onConfirm}
              fullWidth
            >
              {t('Swap Now')}
            </Button>
          </Stack>
        </Stack>
      )}
    </Overlay>
  );
}
