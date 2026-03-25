import { Network, TxHistoryItem } from '@core/types';
import { useWalletContext } from '@core/ui';
import { useEffect, useState } from 'react';

export function useAccountHistory(
  networkId: Network['chainId'],
): TxHistoryItem[] | null {
  const { getTransactionHistory } = useWalletContext();
  const [history, setHistory] = useState<TxHistoryItem[] | null>(null);

  useEffect(() => {
    setHistory(null);
    const controller = new AbortController();

    // Tear down async work in cleanup (legacy React: cancel subscriptions / cancelable promises —
    // https://legacy.reactjs.org/blog/2015/12/16/ismounted-antipattern.html), not an `isMounted`→setState guard.
    void getTransactionHistory(networkId, { signal: controller.signal }).then(
      (transactions) => {
        setHistory(transactions);
      },
      (error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }
        console.error(error);
      },
    );

    return () => {
      controller.abort();
    };
  }, [getTransactionHistory, networkId]);

  return history;
}
