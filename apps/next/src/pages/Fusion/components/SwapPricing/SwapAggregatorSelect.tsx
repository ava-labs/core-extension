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
import { FC, useCallback, useState } from 'react';
import { Quote } from '@avalabs/unified-asset-transfer';
import { bigIntToString } from '@avalabs/core-utils-sdk';

import { useSettingsContext } from '@core/ui';

import * as Styled from '../Styled';
import { useFusionState } from '../../contexts/FusionStateContext';

type SwapAggregatorSelectProps = {
  quotes: Quote[];
  quote: Quote;
};

export const SwapAggregatorSelect: FC<SwapAggregatorSelectProps> = ({
  quotes,
  quote,
}) => {
  const { t } = useTranslation();
  const { currencyFormatter } = useSettingsContext();
  const theme = useTheme();

  const { toToken, selectQuote, bestQuote } = useFusionState();

  const isChoiceAvailable = Number(quotes.length) > 1;

  const [isProviderMenuOpen, setIsProviderMenuOpen] = useState(false);

  const getPriceInCurrency = useCallback(
    function (_quote: Quote) {
      const price = toToken?.priceInCurrency;
      const amount =
        _quote && price
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
          <Typography variant="body3">{quote.aggregator.name}</Typography>
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
          {quotes.map((q) => {
            const isSelected = q === quote;
            const { amount, formattedAmount } = getPriceInCurrency(q);

            return (
              <StyledMenuItem
                key={q.aggregator.id}
                data-testid={`provider-${q.aggregator.id}`}
                onClick={() => selectQuote(q)}
              >
                <Stack direction="row" alignItems="center" gap={1}>
                  <img
                    src={q.aggregator.logoUrl}
                    width={32}
                    height={32}
                    alt={q.aggregator.name}
                  />
                  <Stack flexGrow={1}>
                    <Typography variant="body3" fontWeight={500}>
                      {q.aggregator.name}
                    </Typography>
                    <Tooltip title={amount}>
                      <Typography variant="caption" color="text.secondary">
                        {q === bestQuote
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
