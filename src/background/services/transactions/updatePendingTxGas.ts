import { filter, firstValueFrom, Subject, switchMap, tap } from 'rxjs';
import { gasPrice$ } from '../gas/gas';
import { PendingTransactions } from './models';
import { pendingTransactions } from './transactions';
import { updatePendingTxParams } from './utils/updatePendingTxParams';

/**
 * if gas price gets updated we want to update the UI so we will use this as the
 * event emitter. This is used by tx confirm pages
 */
export const pendingTxsGasPriceUpdate$ = new Subject<PendingTransactions>();

gasPrice$
  .pipe(
    switchMap(async (gas) => {
      return Promise.all([
        firstValueFrom(pendingTransactions),
        Promise.resolve(gas?.value),
      ]);
    }),
    // if there are no pending TXs then no point in emitting
    filter(([pendingTxs]) => !!Object.values(pendingTxs).length),
    tap(([currentPendingTxs, gasValue]) => {
      const updatedPendingTxs = Object.values(currentPendingTxs).reduce(
        (acc, tx) => {
          return {
            ...acc,
            ...updatePendingTxParams(
              { id: tx.id, params: { ...tx.txParams, gasPrice: gasValue } },
              tx
            ),
          };
        },
        {}
      );

      pendingTransactions.next(updatedPendingTxs);
      pendingTxsGasPriceUpdate$.next(updatedPendingTxs);
    })
  )
  .subscribe();
