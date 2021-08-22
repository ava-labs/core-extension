import { JsonRpcRequest } from '@src/utils/jsonRpcEngine';
import {
  isTxParams,
  Transaction,
  TxStatus,
  txParams,
  txParamsUpdate,
  txStatusUpdate,
  isTxParamsUpdate,
  isTxFinalizedUpdate,
  isTxStatusUpdate,
} from './models';
import { tap, switchMap } from 'rxjs/operators';
import { BehaviorSubject, firstValueFrom, Subject } from 'rxjs';
import { updatePendingTxParams } from './utils/updatePendingTxParams';
import {
  updateTxStatus,
  updateTxStatusFinalized,
} from './utils/updateTxStatus';
import { gasPrice } from '../gas/gas';
import {
  getTransactionsFromStorage,
  saveTransactionsToStorage,
} from './storage';

export const transactions$ = new BehaviorSubject<Transaction[]>([]);

getTransactionsFromStorage().then((txs) => txs && transactions$.next(txs));

export const pendingTransactions = new BehaviorSubject<{
  [id: string]: Transaction;
}>({});

export const addTransaction = new Subject<JsonRpcRequest<txParams[]>>();
export const updateTransaction = new Subject<txParamsUpdate | txStatusUpdate>();

addTransaction
  .pipe(
    switchMap(async (newTx) => {
      return Promise.all([
        firstValueFrom(pendingTransactions),
        Promise.resolve(newTx),
        firstValueFrom(gasPrice),
      ]);
    }),
    tap(([currentPendingTxs, data, gasPrice]) => {
      const { params } = data;
      const now = new Date().getTime();
      const txParams = (params || [])[0];

      if (txParams && isTxParams(txParams)) {
        pendingTransactions.next({
          ...currentPendingTxs,
          [`${data.id}`]: {
            id: data.id,
            time: now,
            status: TxStatus.PENDING,
            /**
             * TODO:
             * both the network id and the chain id can come from the current selected network.
             * in the useNetwork hook there is a read network from storage.
             */
            metamaskNetworkId: '1',
            chainId: '0xa869',
            txParams: { ...txParams, gasPrice: gasPrice?.value },
            type: 'standard',
            transactionCategory: 'transfer',
          },
        });
      }
    })
  )
  .subscribe();

updateTransaction
  .pipe(
    switchMap(async (newTx) => {
      return Promise.all([
        firstValueFrom(transactions$),
        firstValueFrom(pendingTransactions),
        Promise.resolve(newTx),
      ]);
    }),
    tap(([currentTxs, currentPendingTxs, update]) => {
      const tx = currentPendingTxs[update.id];

      if (isTxParamsUpdate(update)) {
        pendingTransactions.next({
          ...currentPendingTxs,
          ...updatePendingTxParams(update, tx),
        });
      } else if (isTxStatusUpdate(tx)) {
        pendingTransactions.next({
          ...currentPendingTxs,
          ...updateTxStatus(update, tx),
        });
      } else if (isTxFinalizedUpdate(tx)) {
        transactions$.next([
          ...currentTxs,
          updateTxStatusFinalized(update, tx),
        ]);
        const { [`${update.id}`]: _removed, ...txs } = currentPendingTxs;
        pendingTransactions.next(txs);
      }
    })
  )
  .subscribe();

transactions$
  .pipe(tap((results) => saveTransactionsToStorage(results)))
  .subscribe();
