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
  TransactionDisplayValues,
} from './models';
import { tap, switchMap, filter } from 'rxjs/operators';
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
import {
  network$,
  wallet$,
  walletState$,
} from '@avalabs/wallet-react-components';
import { contractParserMap } from '@src/contracts/contractParsers/contractParserMap';
import { DisplayValueParserProps } from '@src/contracts/contractParsers/models';
import { parseBasicDisplayValues } from '@src/contracts/contractParsers/utils/parseBasicDisplayValues';
import { ExtensionConnectionMessage } from '@src/background/connections/models';
import { walletInitializedFilter } from '../wallet/utils/walletInitializedFilter';
import * as ethers from 'ethers';
import { getTxInfo, isTxDescriptionError } from './getTxInfo';
import abiDecoder from 'abi-decoder';
import hstABI from 'human-standard-token-abi';
import { storageKey$ } from '../wallet/storageKey';

abiDecoder.addABI(hstABI);

export const transactions$ = new BehaviorSubject<Transaction[]>([]);

storageKey$
  .pipe(
    filter((ready) => !!ready),
    switchMap(() => getTransactionsFromStorage())
  )
  .subscribe((txs) => txs && transactions$.next(txs));

export const pendingTransactions$ = new BehaviorSubject<{
  [id: string]: Transaction;
}>({});

export const addTransaction = new Subject<JsonRpcRequest<txParams[]>>();
export const updateTransaction = new Subject<txParamsUpdate | txStatusUpdate>();

addTransaction
  .pipe(
    switchMap(async (newTx) => {
      return Promise.all([
        firstValueFrom(pendingTransactions$),
        Promise.resolve(newTx),
        firstValueFrom(gasPrice$),
        firstValueFrom(network$),
        firstValueFrom(walletState$),
        firstValueFrom(wallet$.pipe(walletInitializedFilter())),
      ]);
    }),
    tap(
      async ([
        currentPendingTxs,
        tx,
        gasPrice,
        network,
        walletState,
        wallet,
      ]) => {
        const { params, site } = tx as ExtensionConnectionMessage;

        const now = new Date().getTime();
        const txParams = (params || [])[0];
        const txDescription = await getTxInfo(
          txParams.to.toLocaleLowerCase(),
          txParams.data,
          txParams.value
        );

        const decodedData = (
          txDescription as ethers.utils.TransactionDescription
        ).args;

        const parser = contractParserMap.get(
          (txDescription as ethers.utils.TransactionDescription).name
        );

        if (txParams && isTxParams(txParams)) {
          const displayValueProps = {
            gasPrice,
            erc20Tokens: walletState?.erc20Tokens,
            avaxPrice: walletState?.avaxPrice,
            avaxToken: walletState?.avaxToken,
            site,
          } as DisplayValueParserProps;

          /**
           * Some requests, revoke approval, dont have gasLimit on it so we make sure its there
           */
          const gasLimit: any = await (txParams.gas
            ? Promise.resolve(false)
            : wallet.estimateGas(txParams.to, txParams.data as string));

          const txParamsWithGasLimit = gasLimit
            ? { gas: `${gasLimit}`, ...txParams }
            : txParams;

          const description = isTxDescriptionError(txDescription)
            ? txDescription
            : undefined;

          const displayValues: TransactionDisplayValues = parser
            ? await parser(
                txParamsWithGasLimit,
                decodedData,
                displayValueProps,
                description
              )
            : (parseBasicDisplayValues(
                txParamsWithGasLimit,
                displayValueProps,
                description
              ) as any);

          const networkMetaData = network
            ? {
                metamaskNetworkId: network.config.networkID.toString(),
                chainId: network.chainId,
              }
            : { metamaskNetworkId: '', chainId: '' };

          pendingTransactions$.next({
            ...currentPendingTxs,
            [`${tx.id}`]: {
              id: tx.id,
              time: now,
              status: TxStatus.PENDING,
              ...networkMetaData,
              txParams: txParamsWithGasLimit,
              displayValues,
              type: 'standard',
              transactionCategory: 'transfer',
            },
          });
        }
      }
    )
  )
  .subscribe();

updateTransaction
  .pipe(
    switchMap(async (update) => {
      return Promise.all([
        firstValueFrom(transactions$),
        firstValueFrom(pendingTransactions$),
        Promise.resolve(update),
      ]);
    }),
    tap(([currentTxs, currentPendingTxs, update]) => {
      const tx = currentPendingTxs[update.id];

      if (isTxParamsUpdate(update)) {
        pendingTransactions$.next({
          ...currentPendingTxs,
          ...updatePendingTxParams(update, tx),
        });
      } else if (
        isTxStatusUpdate(tx) &&
        update.status !== TxStatus.SIGNED &&
        update.status !== TxStatus.ERROR &&
        update.status !== TxStatus.ERROR_USER_CANCELED
      ) {
        pendingTransactions$.next({
          ...currentPendingTxs,
          ...updateTxStatus(update, tx),
        });
      } else if (isTxFinalizedUpdate({ ...tx, ...update })) {
        transactions$.next([
          ...currentTxs,
          updateTxStatusFinalized(update, tx),
        ]);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [`${update.id}`]: _removed, ...txs } = currentPendingTxs;
        pendingTransactions$.next(txs);
      }
    })
  )
  .subscribe();

// wait for key to start storing transactions in storage
storageKey$
  .pipe(
    filter((ready) => !!ready),
    switchMap(() =>
      transactions$.pipe(tap((results) => saveTransactionsToStorage(results)))
    )
  )
  .subscribe();
