import { ExtensionConnectionEvent } from '@src/background/connections/models';
import { filter, map, Observable } from 'rxjs';
import { Transaction } from '../models';
import { TransactionEvent } from './models';

export function transactionFinalizedUpdateListener(id: string) {
  return (
    observer: Observable<ExtensionConnectionEvent<Transaction[]>>
  ): Observable<Transaction> =>
    observer.pipe(
      filter((evt) => TransactionEvent.TRANSACTION_FINALIZED === evt.name),
      map((evt) =>
        evt.value.reduce(
          (acc, tx) => ({
            ...acc,
            [`${tx.id}`]: tx,
          }),
          {}
        )
      ),
      map((indexedTxs) => indexedTxs[id]),
      filter((tx) => !!tx)
    );
}
