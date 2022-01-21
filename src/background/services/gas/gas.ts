import {
  BehaviorSubject,
  filter,
  interval,
  map,
  pairwise,
  switchMap,
  tap,
} from 'rxjs';
import { BN, Utils, GasHelper } from '@avalabs/avalanche-wallet-sdk';
import { GasPrice } from './models';

const SECONDS_30 = 1000 * 30;
export const gasPrice$ = new BehaviorSubject<GasPrice | undefined>(undefined);

function getGasPrice(): Promise<BN> {
  return GasHelper.getAdjustedGasPrice();
}

function parseGasPrice(bn: BN) {
  const value = Utils.bnToLocaleString(bn, 9);
  return {
    bn,
    value,
  };
}

getGasPrice()
  .then(parseGasPrice)
  .then((res) => gasPrice$.next(res));

interval(SECONDS_30)
  .pipe(
    switchMap(() => getGasPrice()),
    pairwise(),
    filter(
      ([oldPrice, newPrice]) => oldPrice.toString() !== newPrice.toString()
    ),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    map(([_, newPrice]) => parseGasPrice(newPrice)),
    tap((res: any) => {
      gasPrice$.next(res);
    })
  )
  .subscribe();
