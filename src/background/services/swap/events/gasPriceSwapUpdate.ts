import { map } from 'rxjs';
import { gasPrice$ } from '../../gas/gas';
import { SwapEvent } from './models';

export function gasPriceSwapUpdate() {
  return gasPrice$.pipe(
    map((value) => ({
      name: SwapEvent.GAS_PRICE_UPDATE,
      value,
    }))
  );
}
