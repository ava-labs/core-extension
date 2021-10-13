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
import { gasPrice$ } from '../gas/gas';
import {
  getTransactionsFromStorage,
  saveTransactionsToStorage,
} from './storage';
import { KnownContractABIs } from '@src/contracts';
import { network$, walletState$ } from '@avalabs/wallet-react-components';
import { contractParserMap } from '@src/contracts/contractParsers/contractParserMap';
import { DisplayValueParserProps } from '@src/contracts/contractParsers/models';

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
        firstValueFrom(gasPrice$),
        firstValueFrom(network$),
        firstValueFrom(walletState$),
      ]);
    }),
    tap(([currentPendingTxs, tx, gasPrice, network, walletState]) => {
      const { params } = tx;
      const now = new Date().getTime();
      const txParams = (params || [])[0];

      const knownContract =
        KnownContractABIs.get(txParams.to.toLocaleLowerCase()) ??
        KnownContractABIs.get('erc20');

      const decodedData = knownContract?.parser(
        knownContract?.decoder(txParams.data)
      );

      const parser = contractParserMap.get(decodedData.contractCall);

      if (txParams && isTxParams(txParams)) {
        pendingTransactions.next({
          ...currentPendingTxs,
          [`${tx.id}`]: {
            id: tx.id,
            time: now,
            status: TxStatus.PENDING,
            metamaskNetworkId: network.config.networkID.toString(),
            chainId: network.chainId,
            txParams,
            displayValues: parser
              ? parser(txParams, decodedData, {
                  gasPrice,
                  erc20Tokens: walletState?.erc20Tokens,
                  avaxPrice: walletState?.avaxPrice,
                  avaxToken: walletState?.avaxToken,
                } as DisplayValueParserProps)
              : (undefined as any),
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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [`${update.id}`]: _removed, ...txs } = currentPendingTxs;
        pendingTransactions.next(txs);
      }
    })
  )
  .subscribe();

transactions$
  .pipe(tap((results) => saveTransactionsToStorage(results)))
  .subscribe();
