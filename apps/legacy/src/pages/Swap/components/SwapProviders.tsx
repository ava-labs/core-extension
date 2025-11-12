import { useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Stack,
  Typography,
  useTheme,
  styled,
  ChevronUpIcon,
  Menu,
  MenuItem,
  Button,
  ChevronDownIcon,
  CheckIcon,
} from '@avalabs/core-k2-components';
import { IoSparklesOutline } from 'react-icons/io5';
import { isMarkrQuote, SwapQuote, useSettingsContext } from '@core/ui';
import {
  NormalizedSwapQuoteResult,
  SwapProviders as SwapProvidersType,
} from '@core/ui/src/contexts/SwapProvider/types';
import { SwappableToken } from '../models';
import { bigIntToString } from '@avalabs/core-utils-sdk';
import { MarkrQuote } from '@core/ui/src/contexts/SwapProvider/models';

interface SwapProvidersProps {
  toToken: SwappableToken;
  quote: SwapQuote | null;
  quotes: NormalizedSwapQuoteResult | null;
  setQuotes: (quotes: NormalizedSwapQuoteResult | null) => void;
  manuallySelected: boolean;
  setManuallySelected: (manuallySelected: boolean) => void;
}

const DetailsRow = styled(Stack)`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  margin: 8px 0;
  align-items: center;
`;

export function SwapProviders({
  toToken,
  quote,
  quotes,
  setQuotes,
  manuallySelected,
  setManuallySelected,
}: SwapProvidersProps) {
  const { t } = useTranslation();
  const { currencyFormatter } = useSettingsContext();

  const [isProviderMenuOpen, setIsProviderMenuOpen] = useState(false);
  const selectButtonRef = useRef<HTMLDivElement>(null);

  const theme = useTheme();

  const getPriceInCurrency = useCallback(
    function (_quote: SwapQuote) {
      const price = toToken?.priceInCurrency;
      const amount =
        _quote && isMarkrQuote(_quote) && price
          ? currencyFormatter(
              parseFloat(
                bigIntToString(BigInt(_quote.amountOut), toToken.decimals),
              ) * price,
            )
          : undefined;
      return amount;
    },
    [toToken, currencyFormatter],
  );

  const bestQuote = useMemo(() => {
    return quotes?.quotes[0];
  }, [quotes]);

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
        quote: {
          ...bestRate.quote,
          aggregator: { id: 'auto', name: 'Auto', logo_url: '' },
        },
      },
      ...quotes.quotes,
    ];
  }, [quotes]);

  if (
    !quotes ||
    !bestQuote ||
    !quote ||
    quotes.provider !== SwapProvidersType.MARKR
  ) {
    return null;
  }

  return (
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
        endIcon={isProviderMenuOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
      >
        <Stack
          direction="row"
          sx={{
            columnGap: 1,
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
        >
          {manuallySelected == false ||
          (quote as MarkrQuote).aggregator.id === 'auto'
            ? 'Auto • ' + (bestQuote.quote as MarkrQuote).aggregator.name
            : (quote as MarkrQuote).aggregator.name}
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
          .map((qq, index) => {
            const q = qq.quote as MarkrQuote;
            const isSelected =
              (!manuallySelected && index === 0) ||
              (manuallySelected &&
                q.aggregator.id === (quote as MarkrQuote).aggregator.id);
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
                      <IoSparklesOutline size={32} />
                    ) : (
                      <img
                        src={q.aggregator.logo_url}
                        width={32}
                        height={32}
                        alt={q.aggregator.name}
                      />
                    )}

                    <Stack direction="column" sx={{ columnGap: 1 }}>
                      <Typography variant="body2">
                        {q.aggregator.name}
                      </Typography>
                      <Typography variant="caption">
                        {q.aggregator.id === 'auto'
                          ? t('Best price available')
                          : getPriceInCurrency(q)}
                      </Typography>
                    </Stack>
                  </Stack>

                  {isSelected && <CheckIcon size={16} />}
                </Stack>
              </MenuItem>
            );
          })}
      </Menu>
    </DetailsRow>
  );
}
