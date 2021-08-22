import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
} from '@src/background/connections/models';
import { openExtensionNewWindow } from '@src/utils/extensionUtils';
import { filter, firstValueFrom, map } from 'rxjs';
import { TxStatus } from '../../transactions/models';
import {
  addTransaction,
  pendingTransactions,
  updateTransaction,
} from '../../transactions/transactions';
import { txToCustomEvmTx } from '../../transactions/utils/txToCustomEvmTx';
import { wallet$ } from '../../wallet/wallet';

export async function eth_sendTransaction(data: ExtensionConnectionMessage) {
  const walletResult = await firstValueFrom(wallet$);

  if (!walletResult) {
    return {
      ...data,
      error: new Error('wallet undefined'),
    };
  }

  addTransaction.next(data as any);

  const window = await openExtensionNewWindow(`sign/transaction?id=${data.id}`);

  const windowClosed = window.removed.pipe(
    map(() => 'Window closed before approved')
  );

  const pendingTx = await firstValueFrom(
    pendingTransactions.pipe(
      map((currentPendingTXs) => currentPendingTXs[`${data.id}`]),
      filter((pending) => !!pending)
    )
  );

  return txToCustomEvmTx(pendingTx).then((params) => {
    if (!walletResult || !walletResult.sendCustomEvmTx) {
      throw new Error('wallet is undefined or sned tx method is malformed');
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
          id: data.id,
          result,
        });
        return { ...data, result };
      });
  });
}

export const EthSendTransactionRequest: [
  DAppProviderRequest,
  ConnectionRequestHandler
] = [DAppProviderRequest.ETH_SEND_TX, eth_sendTransaction];
