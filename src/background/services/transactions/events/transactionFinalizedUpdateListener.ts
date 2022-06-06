import { ExtensionConnectionEvent } from '@src/background/connections/models';
import { Transaction } from '../models';
import { TransactionEvent } from '../models';

export function transactionFinalizedUpdateListener(
  evt: ExtensionConnectionEvent<Transaction>
) {
  return evt?.name === TransactionEvent.TRANSACTION_FINALIZED;
}
