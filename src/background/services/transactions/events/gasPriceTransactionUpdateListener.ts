import { ExtensionConnectionEvent } from '@src/background/connections/models';
import { PendingTransactions } from '../models';
import { TransactionEvent } from './models';

export function gasPriceTransactionUpdateListener(
  evt: ExtensionConnectionEvent<PendingTransactions>
) {
  return evt?.name === TransactionEvent.GAS_PRICE_UPDATE;
}
