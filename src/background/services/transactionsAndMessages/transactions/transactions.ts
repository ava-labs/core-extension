import { JsonRpcRequest } from '@src/background/rpc/jsonRpcEngine';
import { txParams } from '@src/store/transaction/types';
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
}

export default new TransactionsService('TRANSACTIONS');
