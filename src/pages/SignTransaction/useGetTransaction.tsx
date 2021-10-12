import { useMemo } from 'react';
import { useState } from 'react';
import { Transaction } from '@src/background/services/transactions/models';
import { useEffect } from 'react';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';
import { filter, merge, map, tap } from 'rxjs';
import { ExtensionRequest } from '@src/background/connections/models';
import { gasPriceTransactionUpdateListener } from '@src/background/services/transactions/events/gasPriceTransactionUpdateListener';
import { transactionFinalizedUpdateListener } from '@src/background/services/transactions/events/transactionFinalizedUpdateListener';

export function useGetTransaction(requestId: string) {
  const { request, events } = useConnectionContext();
  const [transaction, setTransaction] = useState<Transaction>();
  const [hash, setHash] = useState('');

  useEffect(() => {
    const subscription = merge(
      request({
        method: ExtensionRequest.TRANSACTIONS_GET,
        params: [requestId],
      })
      // events!().pipe(
      //   filter(gasPriceTransactionUpdateListener),
      //   map((txs) => txs[requestId])
      // )
    ).subscribe((tx) => setTransaction({ ...transaction, ...tx }));

    subscription.add(
      events!()
        .pipe(
          transactionFinalizedUpdateListener(requestId),
          tap((tx) => setHash(tx.txHash ?? ''))
        )
        .subscribe((tx) => setTransaction({ ...transaction, ...tx }))
    );

    return () => subscription.unsubscribe();
  }, []);

  return useMemo(() => {
    function updateTransaction(update) {
      return request({
        method: ExtensionRequest.TRANSACTIONS_UPDATE,
        params: [update],
      });
    }

    return {
      ...transaction?.displayValues,
      id: transaction?.id,
      txParams: transaction?.txParams,
      updateTransaction,
      hash,
    };
  }, [requestId, transaction]);
}
