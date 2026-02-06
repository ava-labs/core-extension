import {
  ChevronDownIcon,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';
import { FC, useCallback, useState } from 'react';
import { Quote } from '@avalabs/unified-asset-transfer';
import { bigIntToString } from '@avalabs/core-utils-sdk';

import { useSettingsContext } from '@core/ui';

import * as Styled from '../Styled';
import { useFusionState } from '../../contexts';
import { SwapAggregatorList } from './SwapAggregatorList';

type GetPriceInCurrency = (quote: Quote) => {
  amount: number | undefined;
  formattedAmount: string;
};

export const SwapAggregatorSelect: FC<{
  userQuote: Quote | null;
  bestQuote: Quote;
  quotes: Quote[];
}> = ({ userQuote, bestQuote, quotes }) => {
  const { t } = useTranslation();
  const { currencyFormatter } = useSettingsContext();
  const theme = useTheme();

  const { toToken, selectQuoteById } = useFusionState();

  const isChoiceAvailable = Number(quotes.length) > 1;

  const [isProviderMenuOpen, setIsProviderMenuOpen] = useState(false);

  const getPriceInCurrency: GetPriceInCurrency = useCallback(
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

  const selectedName = userQuote
    ? userQuote.aggregator.name
    : t('Auto • {{name}}', { name: bestQuote.aggregator.name });

  return (
    <>
      <Styled.SettingRow title={t('Provider')}>
        <Stack role="button" direction="row" alignItems="center" gap={0.5}>
          <Typography variant="body3">{selectedName}</Typography>
          <IconButton
            size="small"
            disabled={!isChoiceAvailable}
            sx={{ p: 0 }}
            onClick={() => setIsProviderMenuOpen((prev) => !prev)}
          >
            <ChevronDownIcon
              size={24}
              color={theme.palette.text.secondary}
              sx={{
                transition: theme.transitions.create('transform'),
                transform: isProviderMenuOpen
                  ? 'rotateX(180deg)'
                  : 'rotateX(0deg)',
              }}
            />
          </IconButton>
        </Stack>
      </Styled.SettingRow>
      {isChoiceAvailable && (
        <SwapAggregatorList
          isOpen={isProviderMenuOpen}
          userQuote={userQuote}
          bestQuote={bestQuote}
          quotes={quotes}
          selectQuoteById={selectQuoteById}
          getPriceInCurrency={getPriceInCurrency}
        />
      )}
    </>
  );
};
