import {
  Asset,
  Chain,
  Quote,
  TransferManager,
  type QuoterEventHandler,
} from '@avalabs/unified-asset-transfer';
import { useEffect, useState } from 'react';

export const useQuotes = (
  manager: TransferManager,
  fromAddress: string,
  sourceAsset: Asset,
  sourceChain: Chain,
  targetAsset: Asset,
  targetChain: Chain,
  toAddress: string,
  amount: bigint,
) => {
  const quoter = manager.getQuoter({
    amount,
    slippageBps: 100, // TODO:
    fromAddress,
    sourceAsset,
    sourceChain,
    targetAsset,
    targetChain,
    toAddress,
  });

  const [bestQuote, setBestQuote] = useState<Quote | null>(null);
  const [allQuotes, setAllQuotes] = useState<Quote[]>([]);

  const subscribeCallback: QuoterEventHandler = (event, data) => {
		switch (event) {
			case 'error': {
				console.error('QUOTE ERROR:', data);
				break;
			}

			case 'quote': {
				// `data` contains the new incoming quote, the new bestQuote, and quotes array (of active quotes).
				// Use this event type to update your quote state in the app.
				console.log('QUOTE RECEIVED:', data);
				break;
			}
		}
  };

  useEffect(() => {
    const unsubscribe = quoter.subscribe(subscribeCallback);

    // Call at anytime, get the current best quote / all quotes.
    // This can be called after unsubscribe too, but be aware that as quotes expire the return value with change
    // as quotes get pruned from expiration. Prefer using the "quote" event to update app state for quotes.
    const [_bestQuote, _allQuotes] = quoter.getQuotes();

    setBestQuote(_bestQuote);
    setAllQuotes(_allQuotes);
    // Unsubscribe at some point (ie once user has accepted a quote to issue)
    return unsubscribe;
  }, [quoter]);
};
