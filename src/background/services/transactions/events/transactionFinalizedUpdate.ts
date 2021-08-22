import { filter, map } from 'rxjs';
import { transactions$ } from '../transactions';
import { TransactionEvent } from './models';

export function transactionFinalizedUpdate() {
  return transactions$.pipe(
    filter((values) => !!(values && values.length)),
    map((value) => ({ name: TransactionEvent.TRANSACTION_FINALIZED, value }))
  );
}
