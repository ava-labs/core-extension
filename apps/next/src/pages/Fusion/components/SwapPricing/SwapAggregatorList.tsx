import {
  Box,
  Collapse,
  getHexAlpha,
  Stack,
  useTheme,
} from '@avalabs/k2-alpine';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { HiOutlineSparkles } from 'react-icons/hi2';
import { Quote } from '@avalabs/unified-asset-transfer';

import { useAutomaticQuote } from './hooks/useAutomaticQuote';
import { SwapAggregatorItem } from './SwapAggregatorItem';
import { SwapAggregatorLogo } from './SwapAggregatorLogo';

export const SwapAggregatorList: FC<{
  isOpen: boolean;
  quotes: Quote[];
  userQuote: Quote | null;
  bestQuote: Quote;
  selectQuoteById: (quoteId: string | null) => void;
  getPriceInCurrency: (quote: Quote) => {
    amount: number | undefined;
    formattedAmount: string;
  };
}> = ({ getPriceInCurrency, isOpen, userQuote, quotes, selectQuoteById }) => {
  const { t } = useTranslation();
  const autoQuote = useAutomaticQuote();
  const theme = useTheme();

  return (
    <Collapse in={isOpen}>
      <Stack mx={-2} px={1}>
        <SwapAggregatorItem
          id={autoQuote.id}
          name={autoQuote.aggregatorName}
          logo={
            <Box
              width={32}
              height={32}
              display="flex"
              alignItems="center"
              justifyContent="center"
              sx={{
                backgroundColor: getHexAlpha(theme.palette.primary.main, 10),
                borderRadius: '50%',
              }}
            >
              <HiOutlineSparkles size={24} />
            </Box>
          }
          isSelected={!userQuote}
          formattedAmount={t('Best price available')}
          onClick={() => selectQuoteById(null)}
        />
        {quotes.map((q) => {
          return (
            <SwapAggregatorItem
              key={q.id}
              id={q.id}
              name={q.aggregator.name}
              logo={
                <SwapAggregatorLogo
                  logoUrl={q.aggregator.logoUrl}
                  name={q.aggregator.name}
                />
              }
              isSelected={q.id === userQuote?.id}
              onClick={() => selectQuoteById(q.id)}
              {...getPriceInCurrency(q)}
            />
          );
        })}
      </Stack>
    </Collapse>
  );
};
