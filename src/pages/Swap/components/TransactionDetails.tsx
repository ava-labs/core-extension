import { useState } from 'react';
import { SlippageToolTip } from './SlippageToolTip';
import { useTranslation } from 'react-i18next';
import {
  Stack,
  Typography,
  useTheme,
  styled,
  ChevronUpIcon,
  TextField,
  Grow,
  Tooltip,
  InfoCircleIcon,
} from '@avalabs/core-k2-components';
import { PARASWAP_PARTNER_FEE_BPS } from '@src/contexts/SwapProvider/constants';
import {
  formatBasisPointsToPercentage,
  isSlippageValid,
  MIN_SLIPPAGE,
} from '../utils';
import { useFeatureFlagContext } from '@src/contexts/FeatureFlagsProvider';
import { FeatureGates } from '@src/background/services/featureFlags/models';

interface TransactionDetailsProps {
  fromTokenSymbol: string;
  toTokenSymbol: string;
  rate: number;
  slippage: string;
  setSlippage: (slippage: string) => void;
  setIsOpen?: (isOpen: boolean) => void;
  isTransactionDetailsOpen?: boolean;
}

const Container = styled('div')`
  margin-bottom: 32px;
`;

const TitleContainer = styled(Stack)`
  flex-direction: row;
  cursor: pointer;
`;

const DetailsContainer = styled(Stack)`
  width: 100%;
`;
const DetailsRow = styled(Stack)`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  margin: 8px 0;
  align-items: center;
`;

export function TransactionDetails({
  fromTokenSymbol,
  toTokenSymbol,
  rate,
  slippage,
  setSlippage,
  setIsOpen,
  isTransactionDetailsOpen,
}: TransactionDetailsProps) {
  const { t } = useTranslation();
  const { isFlagEnabled } = useFeatureFlagContext();
  const [isDetailsOpen, setIsDetailsOpen] = useState(
    isTransactionDetailsOpen || false,
  );
  const [error, setError] = useState('');

  const theme = useTheme();

  return (
    <Container>
      <TitleContainer
        onClick={() => {
          setIsDetailsOpen(!isDetailsOpen);
          if (!setIsOpen) {
            return;
          }
          setIsOpen(!isDetailsOpen);
        }}
      >
        <DetailsRow>
          <Stack>
            <Typography
              variant="body2"
              sx={{ fontWeight: theme.typography.fontWeightMedium }}
            >
              {t('Transaction details')}
            </Typography>
          </Stack>
          <Stack sx={{ width: '24px' }}>
            <ChevronUpIcon
              size={21}
              sx={{
                transition: 'transform ease .15s',
                transform: isDetailsOpen ? 'rotateX(0deg)' : 'rotateX(180deg)',
              }}
            />
          </Stack>
        </DetailsRow>
      </TitleContainer>
      <Grow in={isDetailsOpen}>
        <DetailsContainer>
          <DetailsRow>
            <Typography
              variant="body2"
              sx={{ fontWeight: theme.typography.fontWeightSemibold }}
            >
              {t('Rate')}
            </Typography>
            <Typography variant="body2">
              1 {fromTokenSymbol} ≈ {rate?.toFixed(4)} {toTokenSymbol}
            </Typography>
          </DetailsRow>
          <Stack>
            <Stack sx={{ flexDirection: 'row', alignItems: 'center', mb: 1 }}>
              <Typography
                variant="body2"
                sx={{
                  my: 0,
                  mr: 1,
                  ml: 0,
                  fontWeight: theme.typography.fontWeightSemibold,
                }}
              >
                {t('Slippage tolerance')}
              </Typography>
              <SlippageToolTip />
            </Stack>
            <Stack sx={{ flexDirection: 'column', gap: 0.5, width: '100%' }}>
              <TextField
                data-testid="swap-slippage-tolerance-input"
                size={'small'}
                value={slippage}
                placeholder="Input Percent %"
                fullWidth
                type="number"
                InputProps={{
                  inputProps: {
                    min: MIN_SLIPPAGE,
                    max: 100,
                    step: 0.1,
                  },
                }}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  setSlippage(inputValue);

                  if (isSlippageValid(inputValue)) {
                    setError('');
                  } else {
                    setError(t('Enter a value of at least 0.1%'));
                  }
                }}
              />
              <Typography variant="caption" color="error.main" minHeight="14px">
                {error}
              </Typography>
            </Stack>
          </Stack>
          {isFlagEnabled(FeatureGates.SWAP_FEES) && (
            <DetailsRow
              sx={{
                mt: 2,
                justifyContent: 'start',
              }}
            >
              <Typography variant="caption" color="text.secondary">
                {t('Quote includes a {{formattedFeePercent}} Core fee', {
                  formattedFeePercent: formatBasisPointsToPercentage(
                    PARASWAP_PARTNER_FEE_BPS,
                  ),
                })}
              </Typography>
              <Tooltip
                sx={{
                  px: 1,
                }}
                isInfo
                title={t(
                  'Core always finds the best price from the top liquidity providers. A fee of {{formattedFeePercent}} is automatically factored into this quote.',
                  {
                    formattedFeePercent: formatBasisPointsToPercentage(
                      PARASWAP_PARTNER_FEE_BPS,
                    ),
                  },
                )}
              >
                <InfoCircleIcon sx={{ color: 'text.secondary' }} />
              </Tooltip>
            </DetailsRow>
          )}
        </DetailsContainer>
      </Grow>
    </Container>
  );
}
