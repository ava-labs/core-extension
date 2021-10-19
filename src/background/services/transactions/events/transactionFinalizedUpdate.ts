import { filter, map } from 'rxjs';
import { transactions$ } from '../transactions';
import { TransactionEvent } from './models';

export function transactionFinalizedUpdate() {
  return transactions$.pipe(
    filter((values) => {
      return !!(values && values.length);
    }),
    map((value) => {
      return { name: TransactionEvent.TRANSACTION_FINALIZED, value };
    })
  );
}
