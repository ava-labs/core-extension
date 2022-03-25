import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { DappRequestHandler } from '@src/background/connections/models';
import { openExtensionNewWindow } from '@src/utils/extensionUtils';
import { defer, filter, firstValueFrom, map, merge, tap } from 'rxjs';
import { TxStatus } from '../../transactions/models';
import {
  addTransaction,
  pendingTransactions$,
  updateTransaction,
} from '../../transactions/transactions';
import { txToCustomEvmTx } from '../../transactions/utils/txToCustomEvmTx';
import { wallet$ } from '@avalabs/wallet-react-components';

class EthSendTransactionHandler implements DappRequestHandler {
  handleUnauthenticated = async (request) => {
    return {
      ...request,
      error: 'account not connected',
    };
  };

  handleAuthenticated = async (request) => {
    const walletResult = await firstValueFrom(wallet$);

    if (!walletResult) {
      return {
        ...request,
        error: 'wallet undefined',
      };
    }

    addTransaction.next(request);

    // wait for the transaction to be added to the pending transactions
    await firstValueFrom(
      pendingTransactions$.pipe(
        filter((currentPendingTXs) => !!currentPendingTXs[`${request.id}`])
      )
    );

    const window = await openExtensionNewWindow(
      `sign/transaction?id=${request.id}`,
      '',
      request.meta?.coords
    );

    const windowClosed$ = window.removed.pipe(
      map(() => ({
        ...request,
        error: 'Window closed before approved',
      })),
      tap(() => {
        updateTransaction.next({
          status: TxStatus.ERROR_USER_CANCELED,
          id: request.id,
          error: 'Window closed before approved',
        });
      })
    );

    const signTx$ = defer(async () => {
      const pendingTx = await firstValueFrom(
        pendingTransactions$.pipe(
          map((currentPendingTXs) => currentPendingTXs[`${request.id}`]),
          filter(
            (pending) => !!pending && pending.status === TxStatus.SUBMITTING
          )
        )
      );

      return txToCustomEvmTx(pendingTx).then((params) => {
        if (!walletResult || !walletResult.sendCustomEvmTx) {
          return {
            ...request,
            error: 'wallet is undefined or send tx method is malformed',
          };
        }

        return walletResult
          .sendCustomEvmTx(
            params.gasPrice,
            params.gasLimit,
            params.data,
            params.to,
            params.value
          )
          .then((result) => {
            updateTransaction.next({
              status: TxStatus.SIGNED,
              id: request.id,
              result,
            });
            return { ...request, result };
          })
          .catch((err) => {
            console.error(err);
            updateTransaction.next({
              status: TxStatus.ERROR,
              id: request.id,
              error: err?.message ?? err,
            });
            return { ...request, error: err };
          });
      });
    });

    return firstValueFrom(merge(windowClosed$, signTx$));
  };
}

export const EthSendTransactionRequest: [
  DAppProviderRequest,
  DappRequestHandler
] = [DAppProviderRequest.ETH_SEND_TX, new EthSendTransactionHandler()];
