import { JsonRpcRequest } from '@src/background/rpc/jsonRpcEngine';
import { formatAndLog } from '@src/background/utils/logging';
import storageListener from '@src/background/utils/storage';
import { txParams } from '@src/store/transaction/types';
import { ReadableSignal } from 'micro-signals';
import { TransactionsAndMessagesBase } from '../txAndMessagesBase';
import { isTxParams, Transaction, TxStatus } from './models';

class TransactionsService extends TransactionsAndMessagesBase<Transaction> {
  addTransaction(data: JsonRpcRequest<txParams[]>) {
    const { params } = data;
    const now = new Date().getTime();
    const txParams = (params || [])[0];

    if (txParams && isTxParams(txParams)) {
      this.save({
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
        txParams,
        type: 'standard',
        transactionCategory: 'transfer',
      });
    } else {
      console.error('tx params malformed: ', txParams);
    }

    return {
      listenForTxPending: (cancel: ReadableSignal<any>) => {
        return this.listenForTransactionPending(data.id as string, cancel);
      },
    };
  }

  updateTransactionStatus({
    status,
    id,
    result,
  }: {
    status: TxStatus;
    id: Transaction['id'];
    result?: string;
  }) {
    const pendingTx = this.getById(id);
    if (pendingTx) {
      this.update({
        ...pendingTx,
        status,
        ...(result ? { txHash: result } : {}),
      });
    } else {
      console.error('attempting to update a tx that isnt in the set');
    }
  }

  updateTransactionParams(id: Transaction['id'], params: txParams) {
    const pendingTx = this.getById(id);
    if (pendingTx) {
      this.update({
        ...pendingTx,
        txParams: params,
      });
    } else {
      console.error('attempting to update a tx that isnt in the set');
    }
  }

  listenForTransactionFinalized(id: string, cancled?: ReadableSignal<any>) {
    return storageListener
      .map(() => this.getById(id)?.txHash)
      .filter((result) => !!result)
      .promisify(cancled);
  }

  /**
   * Here we are waiting for the tx to be "approved" in the UI, we will then access the wallet
   * and perform the tx from the background. This makes it so we dont expose the wallet to the UI.
   *
   * @param id the id of the transaction in storage
   * @param cancled the event that tells us the window was closed we can stop listening
   * @returns the transaction
   */
  listenForTransactionPending(id: string, cancled: ReadableSignal<any>) {
    return storageListener
      .filter(() => this.getById(id)?.status === TxStatus.SUBMITTING)
      .peek(() =>
        formatAndLog('submitting transaction fired', this.getById(id))
      )
      .map(() => this.getById(id))
      .promisify(cancled);
  }
}

export default new TransactionsService('TRANSACTIONS');
