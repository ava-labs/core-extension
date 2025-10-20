import {
  ChevronDownIcon,
  Collapse,
  IconButton,
  MenuItem,
  Stack,
  styled,
  Tooltip,
  Typography,
  useTheme,
} from '@avalabs/k2-alpine';
import { FaCheck } from 'react-icons/fa6';
import { useTranslation } from 'react-i18next';
import { bigIntToString } from '@avalabs/core-utils-sdk';
import { FC, useCallback, useMemo, useState } from 'react';

import {
  isMarkrQuote,
  MarkrNormalizedQuoteResult,
  MarkrQuote,
  useSettingsContext,
} from '@core/ui';

import * as Styled from '../Styled';
import { useSwapState } from '../../contexts';

type SwapAggregatorSelectProps = {
  quotes: MarkrNormalizedQuoteResult;
  quote: MarkrQuote;
};

export const SwapAggregatorSelect: FC<SwapAggregatorSelectProps> = ({
  quotes,
  quote,
}) => {
  const { t } = useTranslation();
  const { currencyFormatter } = useSettingsContext();
  const theme = useTheme();

  const { toToken, setQuotes, manuallySelected, setManuallySelected } =
    useSwapState();

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
          aggregator: { id: 'auto', name: t('Auto'), logo_url: '' },
        },
      },
      ...quotes.quotes,
    ];
  }, [quotes, t]);

  const isChoiceAvailable = Number(quotes?.quotes.length) > 1;
  const selectableProviders = providers.filter((p) => isMarkrQuote(p.quote));

  const [isProviderMenuOpen, setIsProviderMenuOpen] = useState(false);

  const getPriceInCurrency = useCallback(
    function (_quote: MarkrQuote) {
      const price = toToken?.priceInCurrency;
      const amount =
        _quote && isMarkrQuote(_quote) && price
          ? parseFloat(
              bigIntToString(BigInt(_quote.amountOut), toToken.decimals),
            ) * price
          : undefined;
      return {
        amount,
        formattedAmount:
          typeof amount === 'number' ? currencyFormatter(amount, false) : '-',
      };
    },
    [toToken, currencyFormatter],
  );

  return (
    <>
      <Styled.SettingRow title={t('Provider')}>
        <Stack role="button" direction="row" alignItems="center" gap={0.5}>
          <Typography variant="body3">
            {!manuallySelected || quote?.aggregator.id === 'auto'
              ? t('Auto • {{name}}', { name: quote?.aggregator.name })
              : quote?.aggregator.name}
          </Typography>
          <IconButton
            size="small"
            disabled={!isChoiceAvailable}
            sx={{ p: 0 }}
            onClick={() => setIsProviderMenuOpen((prev) => !prev)}
          >
            <ChevronDownIcon
              size={24}
              color={theme.palette.text.secondary}
              transform={
                isProviderMenuOpen ? 'rotateX(180deg)' : 'rotateX(0deg)'
              }
            />
          </IconButton>
        </Stack>
      </Styled.SettingRow>
      <Collapse in={isProviderMenuOpen}>
        <Stack mx={-2} px={1}>
          {selectableProviders.map((p) => {
            const q = p.quote as MarkrQuote;
            const isSelected = manuallySelected
              ? q.aggregator.id === quote?.aggregator.id
              : q.aggregator.id === 'auto';
            const { amount, formattedAmount } = getPriceInCurrency(q);

            return (
              <StyledMenuItem
                key={q.aggregator.id}
                data-testid={`provider-${q.aggregator.id}`}
                onClick={() => {
                  setManuallySelected(true);
                  setQuotes((prev) => (prev ? { ...prev, selected: p } : prev));
                }}
              >
                <Stack direction="row" alignItems="center" gap={1}>
                  {q.aggregator.id !== 'auto' && (
                    <img
                      src={q.aggregator.logo_url}
                      width={32}
                      height={32}
                      alt={q.aggregator.name}
                    />
                  )}
                  <Stack flexGrow={1}>
                    <Typography variant="body3" fontWeight={500}>
                      {q.aggregator.name}
                    </Typography>
                    <Tooltip title={amount}>
                      <Typography variant="caption" color="text.secondary">
                        {q.aggregator.id === 'auto'
                          ? t('Best price available')
                          : formattedAmount}
                      </Typography>
                    </Tooltip>
                  </Stack>
                </Stack>
                {isSelected && <FaCheck size={16} />}
              </StyledMenuItem>
            );
          })}
        </Stack>
      </Collapse>
    </>
  );
};

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  marginInline: 0,
  paddingInline: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  minHeight: 'unset',
  width: 'auto',
  justifyContent: 'space-between',
  alignItems: 'center',
}));
