import { map } from 'rxjs';
import { pendingTxsGasPriceUpdate } from '../updatePendingTxGas';
import { TransactionEvent } from './models';

export function gasPriceTransactionUpdate() {
  return pendingTxsGasPriceUpdate.pipe(
    map((value) => ({
      name: TransactionEvent.GAS_PRICE_UPDATE,
      value,
    }))
  );
}
