import { useCallback, useMemo, useRef, useState } from 'react';
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
  Menu,
  MenuItem,
  Button,
  ChevronDownIcon,
  CheckIcon,
  AvaCloudConnectIcon,
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
  useSettingsContext,
} from '@core/ui';
import {
  formatBasisPointsToPercentage,
  isSlippageValid,
  MIN_SLIPPAGE,
} from '../utils';
import { FeatureGates } from '@core/types';
import { NormalizedSwapQuoteResult } from '@core/ui/src/contexts/SwapProvider/types';
import { SwappableToken } from '../models';
import { bigintToBig, bigToLocaleString } from '@avalabs/core-utils-sdk';
import { MarkrQuote } from '@core/ui/src/contexts/SwapProvider/services/MarkrService';

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
  const { currencyFormatter } = useSettingsContext();

  const [isProviderMenuOpen, setIsProviderMenuOpen] = useState(false);
  const selectButtonRef = useRef<HTMLDivElement>(null);

  const { network } = useNetworkContext();
  const { isFlagEnabled } = useFeatureFlagContext();
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

  const getPriceInCurrency = useCallback(
    function (_quote: SwapQuote) {
      const price = toToken?.priceInCurrency;
      const amount =
        _quote && isMarkrQuote(_quote) && price
          ? currencyFormatter(
              parseFloat(
                bigToLocaleString(
                  bigintToBig(BigInt(_quote.amountOut), toToken.decimals),
                ).replace(/,/g, ''),
              ) * price,
            )
          : undefined;
      return amount;
    },
    [toToken, currencyFormatter],
  );

  const providers = useMemo(() => {
    if (
      !quotes ||
      quotes.quotes.length === 0 ||
      !quotes.selected ||
      !quotes.quotes[0]
    ) {
      return [];
    }
    const bestRate = quotes.quotes[0];
    return [
      {
        ...bestRate,
        quote: { ...bestRate.quote, aggregator: { id: 'auto', name: 'Auto' } },
      },
      ...quotes.quotes,
    ];
  }, [quotes]);

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
          {quotes && quote && isMarkrQuote(quote) && (
            <DetailsRow>
              <Typography
                variant="body2"
                sx={{ fontWeight: theme.typography.fontWeightSemibold }}
              >
                {t('Provider')}
              </Typography>
              <Button
                variant="text"
                disableRipple
                onClick={() => {
                  setIsProviderMenuOpen(!isProviderMenuOpen);
                }}
                ref={selectButtonRef}
                sx={{
                  color: 'primary.main',
                  p: 0.5,
                  '&.Mui-disabled': { color: 'primary.main' },
                }}
                endIcon={
                  isProviderMenuOpen ? <ChevronUpIcon /> : <ChevronDownIcon />
                }
              >
                <Stack
                  direction="row"
                  sx={{
                    columnGap: 1,
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                  }}
                >
                  {manuallySelected == false
                    ? 'Auto • ' + quote.aggregator.name
                    : quote.aggregator.name}
                </Stack>
              </Button>
              <Menu
                anchorEl={selectButtonRef.current}
                open={isProviderMenuOpen}
                onClose={() => {
                  setIsProviderMenuOpen(false);
                }}
                PaperProps={{
                  sx: { width: 220, backgroundColor: 'grey.800', mr: 3 },
                }}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                {providers
                  .filter((q) => isMarkrQuote(q.quote))
                  .map((qq) => {
                    const q = qq.quote as MarkrQuote;
                    return (
                      <MenuItem
                        key={q.aggregator.id}
                        data-testid={`provider-${q.aggregator.id}`}
                        onClick={() => {
                          setManuallySelected(true);
                          setQuotes({ ...quotes, selected: qq });
                          setIsProviderMenuOpen(false);
                        }}
                        disableRipple
                        sx={{ minHeight: 'auto', py: 1 }}
                      >
                        <Stack
                          direction="row"
                          sx={{
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            width: '100%',
                          }}
                        >
                          <Stack
                            direction="row"
                            sx={{
                              columnGap: 1,
                              alignItems: 'center',
                            }}
                          >
                            {q.aggregator.id === 'auto' ? (
                              <AvaCloudConnectIcon size={32} />
                            ) : (
                              <img
                                src={`/images/logos/provider-${q.aggregator.id}.svg`}
                                width={32}
                                height={32}
                                alt=""
                              />
                            )}

                            <Stack direction="column" sx={{ columnGap: 1 }}>
                              <Typography variant="body2">
                                {q.aggregator.name}
                              </Typography>
                              <Typography variant="caption">
                                {getPriceInCurrency(q)}
                              </Typography>
                            </Stack>
                          </Stack>

                          {q.aggregator.name === quote.aggregator.name && (
                            <CheckIcon size={16} />
                          )}
                        </Stack>
                      </MenuItem>
                    );
                  })}
              </Menu>
            </DetailsRow>
          )}
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

                      setError(
                        isSlippageValid(inputValue)
                          ? ''
                          : t('Enter a value of at least 0.1%'),
                      );
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
