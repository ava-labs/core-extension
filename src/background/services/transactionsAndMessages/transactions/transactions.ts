import { JsonRpcRequest } from '@src/background/rpc/jsonRpcEngine';
import storageListener from '@src/background/utils/storage';
import { txParams } from '@src/store/transaction/types';
import { ReadableSignal } from 'micro-signals';
import { TransactionsAndMessagesBase } from '../txAndMessagesBase';
import { isTxParams, Transaction } from './models';

class TransactionsService extends TransactionsAndMessagesBase<Transaction> {
  addTransaction(data: JsonRpcRequest<txParams>, from: string) {
    const { params } = data;
    const now = new Date().getTime();
    const txParams = { ...params, from };

    if (isTxParams(txParams)) {
      this.save({
        id: data.id,
        time: now,
        status: 'string',
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
      listenForUpdates: (cancel: ReadableSignal<any>) => {
        return this.listenForTransactionUpdate(data.id as string, cancel);
      },
    };
  }

  updateTransaction({
    status,
    id,
    result,
  }: {
    status: string;
    id: Transaction['id'];
    result: string;
  }) {
    const pendingTx = this.getById(id);
    if (pendingTx) {
      this.update({
        ...pendingTx,
        status,
        txHash: result,
      });
    } else {
      console.error('attempting to update a tx that isnt in the set');
    }
  }

  listenForTransactionUpdate(id: string, cancled: ReadableSignal<any>) {
    return storageListener
      .map(() => this.getById(id)?.txHash)
      .filter((result) => !!result)
      .promisify(cancled);
  }
}

export default new TransactionsService('TRANSACTIONS');
