import { map } from 'rxjs';
import { gasPrice$ } from '../../gas/gas';
import { TransactionEvent } from './models';

export function gasPriceTransactionUpdate() {
  return gasPrice$.pipe(
    map((value) => ({
      name: TransactionEvent.GAS_PRICE_UPDATE,
      value,
    }))
  );
}
