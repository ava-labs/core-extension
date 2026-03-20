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
    getTransactionHistory(networkId).then(setHistory);
  }, [getTransactionHistory, networkId]);

  return history;
}
