import { Utils } from '@avalabs/avalanche-wallet-sdk';
import {
  filter,
  from,
  interval,
  concat,
  map,
  pairwise,
  mergeMap,
  merge,
} from 'rxjs';

export const avaxPrice = from(Utils.getAvaxPrice());

export const avaxPriceUpdates = merge(
  avaxPrice,
  concat(avaxPrice, interval(5000).pipe(mergeMap(() => avaxPrice))).pipe(
    pairwise(),
    filter(([lastPrice, newPrice]) => lastPrice !== newPrice),
    map(([_, newPrice]) => newPrice)
  )
);
