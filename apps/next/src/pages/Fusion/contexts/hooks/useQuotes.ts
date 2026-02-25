import { useCallback, useEffect, useState } from 'react';
import { Quote } from '@avalabs/unified-asset-transfer';

import { UseQuoterProps, useQuoter } from './useQuoter';
import { QuoteStreamingStatus } from '../../types';

export const useQuotes = ({
  manager,
  fromAddress,
  toAddress,
  sourceAsset,
  sourceChain,
  targetAsset,
  targetChain,
  amount,
  slippageBps,
}: UseQuoterProps) => {
  const [status, setStatus] = useState<QuoteStreamingStatus>('done');
  // The best quote is the quote with the best price
  const [bestQuote, setBestQuote] = useState<Quote | null>(null);
  // The user quote is the quote that the user has manually selected.
  // "null" means that the user has not manually selected a quote.
  const [userQuote, setUserQuote] = useState<Quote | null>(null);
  const [allQuotes, setAllQuotes] = useState<Quote[]>([]);

  const quoter = useQuoter({
    manager,
    fromAddress,
    toAddress,
    sourceAsset,
    sourceChain,
    targetAsset,
    targetChain,
    amount,
    slippageBps,
  });

  useEffect(() => {
    if (!quoter) {
      return;
    }

    setStatus('loading');

    const unsubscribe = quoter.subscribe((event, data) => {
      switch (event) {
        case 'error': {
          console.error('[fusion::useQuotes] streaming failure', data);
          setStatus('error');
          break;
        }

        case 'quote': {
          setBestQuote(data.bestQuote);
          setAllQuotes(Array.from(data.quotes));
          break;
        }

        case 'done': {
          setStatus('done');
          break;
        }
      }
    });

    const [_bestQuote, _allQuotes] = quoter.getQuotes();

    setBestQuote(_bestQuote);
    setAllQuotes(Array.from(_allQuotes));

    return unsubscribe;
  }, [quoter]);

  const selectQuoteById = useCallback(
    (quoteId: Quote['id'] | null) => {
      if (quoteId === null) {
        setUserQuote(null);
      } else {
        setUserQuote(allQuotes.find((q) => q.id === quoteId) ?? null);
      }
    },
    [allQuotes],
  );

  return {
    bestQuote,
    userQuote,
    quotes: allQuotes,
    isUserSelectedQuote: !!userQuote,
    selectedQuote: userQuote ?? bestQuote,
    selectQuoteById,
    status,
  };
};
