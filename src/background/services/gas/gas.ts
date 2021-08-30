import { engine } from '@src/utils/jsonRpcEngine';
import {
  BehaviorSubject,
  filter,
  interval,
  map,
  pairwise,
  switchMap,
  tap,
} from 'rxjs';
import { BN, Utils } from '@avalabs/avalanche-wallet-sdk';
import { GasPrice } from './models';

const SECONDS_30 = 1000 * 10;
export const gasPrice$ = new BehaviorSubject<GasPrice | undefined>(undefined);

function getGasPrice() {
  return engine()
    .then((e) =>
      e.handle({
        jsonrpc: '2.0',
        method: 'eth_gasPrice',
        params: [],
        id: 71,
      })
    )
    .then((res: any) => res.result);
}

function parseGasPrice(hex: string) {
  const bn = new BN(hex);
  const value = Utils.bnToLocaleString(bn, 9);
  return {
    hex,
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
    filter(([oldPrice, newPrice]) => oldPrice !== newPrice),
    map(([_, newPrice]) => parseGasPrice(newPrice)),
    tap((res: any) => {
      gasPrice$.next(res);
    })
  )
  .subscribe();
