import { Network, TxHistoryItem } from '@core/types';
import { useWalletContext } from '@core/ui';
import { use, useEffect, useState } from 'react';

const DEFAULT_START_PROMISE = Promise.resolve([]);

export function useAccountHistory(
  networkId: Network['chainId'],
): TxHistoryItem[] {
  const { getTransactionHistory } = useWalletContext();
  const [promise, setPromise] = useState<Promise<TxHistoryItem[]>>(
    DEFAULT_START_PROMISE,
  );

  useEffect(() => {
    setPromise(getTransactionHistory(networkId));
  }, [getTransactionHistory, networkId]);

  return use(promise);
}
