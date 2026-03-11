import { Collapse, Stack } from '@avalabs/k2-alpine';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { HiOutlineSparkles } from 'react-icons/hi2';
import { Quote } from '@avalabs/fusion-sdk';

import { useAutomaticQuote } from './hooks/useAutomaticQuote';
import { SwapAggregatorItem } from './SwapAggregatorItem';
import { SwapAggregatorLogo } from './SwapAggregatorLogo';
import { SwapAggregatorLogoArea } from './SwapAggregatorLogoArea';

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

  return (
    <Collapse in={isOpen}>
      <Stack mx={-2} px={1}>
        <SwapAggregatorItem
          id={autoQuote.id}
          name={autoQuote.aggregatorName}
          logo={
            <SwapAggregatorLogoArea size={32}>
              <HiOutlineSparkles size={24} />
            </SwapAggregatorLogoArea>
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
                  service={q.serviceType}
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
