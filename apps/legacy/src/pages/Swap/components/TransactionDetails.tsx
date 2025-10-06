import { useMemo, useState } from 'react';
import { NetworkVMType } from '@avalabs/vm-module-types';
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
import {
  isJupiterQuote,
  isMarkrQuote,
  isParaswapQuote,
  JUPITER_PARTNER_FEE_BPS,
  PARASWAP_PARTNER_FEE_BPS,
  SwapQuote,
  useFeatureFlagContext,
  useNetworkContext,
} from '@core/ui';
import {
  formatBasisPointsToPercentage,
  isSlippageValid,
  MIN_SLIPPAGE,
} from '../utils';
import { FeatureGates } from '@core/types';
import { NormalizedSwapQuoteResult } from '@core/ui/src/contexts/SwapProvider/types';
import { SwappableToken } from '../models';
import { SwapProviders } from './SwapProviders';

interface TransactionDetailsProps {
  fromTokenSymbol: string;
  toToken: SwappableToken;
  toTokenSymbol: string;
  rate: number;
  slippage: string;
  setSlippage: (slippage: string) => void;
  setIsOpen?: (isOpen: boolean) => void;
  isTransactionDetailsOpen?: boolean;
  quote: SwapQuote | null;
  quotes: NormalizedSwapQuoteResult | null;
  setQuotes: (quotes: NormalizedSwapQuoteResult | null) => void;
  manuallySelected: boolean;
  setManuallySelected: (manuallySelected: boolean) => void;
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
  toToken,
  toTokenSymbol,
  rate,
  slippage,
  setSlippage,
  setIsOpen,
  isTransactionDetailsOpen,
  quote,
  quotes,
  setQuotes,
  manuallySelected,
  setManuallySelected,
}: TransactionDetailsProps) {
  const { t } = useTranslation();

  const { network } = useNetworkContext();
  const { isFlagEnabled } = useFeatureFlagContext();
  const [slippageInputValue, setSlippageInputValue] = useState(slippage);
  const [isDetailsOpen, setIsDetailsOpen] = useState(
    isTransactionDetailsOpen || false,
  );
  const [error, setError] = useState('');

  const theme = useTheme();

  const swapFeesInfo = useMemo(() => {
    if (!network) {
      return {
        isCollectingFees: false,
      };
    }

    if (network.vmName === NetworkVMType.EVM) {
      const isCollectingFees = isFlagEnabled(FeatureGates.SWAP_FEES);

      return {
        isCollectingFees,
        percentage: isCollectingFees
          ? formatBasisPointsToPercentage(PARASWAP_PARTNER_FEE_BPS)
          : undefined,
      };
    }

    if (network.vmName === NetworkVMType.SVM) {
      const isCollectingFees = isFlagEnabled(FeatureGates.SWAP_FEES_JUPITER);

      return {
        isCollectingFees,
        percentage: isCollectingFees
          ? formatBasisPointsToPercentage(JUPITER_PARTNER_FEE_BPS)
          : undefined,
      };
    }

    return {
      isCollectingFees: false,
    };
  }, [isFlagEnabled, network]);

  const showFeesAndSlippage = useMemo(() => {
    return (
      quote &&
      (isJupiterQuote(quote) || isParaswapQuote(quote) || isMarkrQuote(quote))
    );
  }, [quote]);

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
          <SwapProviders
            quote={quote}
            quotes={quotes}
            setQuotes={setQuotes}
            toToken={toToken}
            manuallySelected={manuallySelected}
            setManuallySelected={setManuallySelected}
          />
          {showFeesAndSlippage && (
            <>
              <Stack>
                <Stack
                  sx={{ flexDirection: 'row', alignItems: 'center', mb: 1 }}
                >
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
                <Stack
                  sx={{ flexDirection: 'column', gap: 0.5, width: '100%' }}
                >
                  <TextField
                    data-testid="swap-slippage-tolerance-input"
                    size={'small'}
                    value={slippageInputValue}
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
                      setSlippageInputValue(inputValue);

                      if (!isSlippageValid(inputValue)) {
                        setError(t('Enter a value of at least 0.01%'));
                        return;
                      }

                      setSlippage(inputValue);
                      setError('');
                    }}
                  />
                  <Typography
                    variant="caption"
                    color="error.main"
                    minHeight="14px"
                  >
                    {error}
                  </Typography>
                </Stack>
              </Stack>
              {swapFeesInfo.isCollectingFees && (
                <DetailsRow
                  sx={{
                    mt: 2,
                    justifyContent: 'start',
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    {t('Quote includes a {{formattedFeePercent}} Core fee', {
                      formattedFeePercent: swapFeesInfo.percentage,
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
                        formattedFeePercent: swapFeesInfo.percentage,
                      },
                    )}
                  >
                    <InfoCircleIcon sx={{ color: 'text.secondary' }} />
                  </Tooltip>
                </DetailsRow>
              )}
            </>
          )}
        </DetailsContainer>
      </Grow>
    </Container>
  );
}
