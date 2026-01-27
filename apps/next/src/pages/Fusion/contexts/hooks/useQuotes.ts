import { useEffect, useState } from 'react';
import { Quote } from '@avalabs/unified-asset-transfer';

import { UseQuoterProps, useQuoter } from './useQuoter';

export const useQuotes = ({
  manager,
  fromAddress,
  toAddress,
  sourceAsset,
  sourceChain,
  targetAsset,
  targetChain,
  amount,
}: UseQuoterProps) => {
  const [bestQuote, setBestQuote] = useState<Quote | null>(null);
  const [allQuotes, setAllQuotes] = useState<Quote[]>([]);
  const [manuallySelectedQuote, setManuallySelectedQuote] =
    useState<Quote | null>(null);

  const quoter = useQuoter({
    manager,
    fromAddress,
    toAddress,
    sourceAsset,
    sourceChain,
    targetAsset,
    targetChain,
    amount,
  });

  useEffect(() => {
    if (!quoter) {
      return;
    }

    const unsubscribe = quoter.subscribe((event, data) => {
      switch (event) {
        case 'error': {
          console.error('Quote streaming failure', data);
          break;
        }

        case 'quote': {
          setBestQuote(data.bestQuote);
          setAllQuotes(Array.from(data.quotes));
          break;
        }
      }
    });

    const [_bestQuote, _allQuotes] = quoter.getQuotes();

    setBestQuote(_bestQuote);
    setAllQuotes(Array.from(_allQuotes));

    return unsubscribe;
  }, [quoter]);

  return {
    bestQuote,
    quote: manuallySelectedQuote ?? bestQuote,
    quotes: allQuotes,
    selectQuote: setManuallySelectedQuote,
  };
};
