import { Network, TxHistoryItem } from '@core/types';
import { useWalletContext } from '@core/ui';
import { use, useEffect, useState } from 'react';

const DEFAULT_START_PROMISE = Promise.resolve<TxHistoryItem[] | null>(null);

export function useAccountHistory(
  networkId: Network['chainId'],
): TxHistoryItem[] | null {
  const { getTransactionHistory } = useWalletContext();
  const [promise, setPromise] = useState<Promise<TxHistoryItem[] | null>>(
    DEFAULT_START_PROMISE,
  );

  useEffect(() => {
    setPromise(getTransactionHistory(networkId));
  }, [getTransactionHistory, networkId]);

  return use(promise);
}
