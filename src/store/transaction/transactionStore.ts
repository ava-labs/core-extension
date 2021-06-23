import { makeAutoObservable, autorun, observable, configure } from 'mobx';
import { persistStore } from '@src/utils/mobx';
import { UnapprovedTransaction, UnapprovedMessage, txParams } from './types';
import { JsonRpcRequest } from 'json-rpc-engine';

class TransactionStore {
  addrX: string = '';

  Transactions: Map<UnapprovedTransaction['id'], UnapprovedTransaction> =
    new Map();
  Messages: Map<UnapprovedMessage['id'], UnapprovedMessage> = new Map();

  constructor() {
    makeAutoObservable(this);
    persistStore(this, ['Transactions', 'Messages'], 'TransactionStore');
  }

  getUnnapprovedTxById(
    id: UnapprovedTransaction['id']
  ): UnapprovedTransaction | undefined {
    return this.Transactions.get(id);
  }

  getUnnaprovedMsgById(
    id: UnapprovedMessage['id']
  ): UnapprovedMessage | undefined {
    return this.Messages.get(id);
  }

  removeUnapprovedTransaction(id: string | number) {
    this.Transactions.delete(id);
  }

  async saveUnapprovedTx(data: JsonRpcRequest<any>, from: string) {
    const { params } = data;
    let { to, value, gas, gasPrice }: txParams = params;
    const now = new Date().getTime();

    let sampleTx = {
      id: data.id,
      time: now,
      status: 'string',
      metamaskNetworkId: '1',
      chainId: '0xa869',
      txParams: {
        from: from,
        to: to,
        value: value,
        gas: gas,
        gasPrice: gasPrice,
      },
      type: 'standard',
      transactionCategory: 'transfer',
    };

    debugger;
    this.Transactions.set(sampleTx.id, sampleTx);
    return;
  }

  async saveUnapprovedMsg(data: JsonRpcRequest<any>, from: string) {
    const { params } = data;

    const now = new Date().getTime();

    let msgData: UnapprovedMessage = {
      id: data.id,
      from,
      time: now,
      status: 'unsigned',
      msgParams: params[1],
      type: 'eth_signTypedData',
    };

    this.Messages.set(msgData.id, msgData);
    return;
  }

  async updateUnapprovedMsg({ status, id, result }) {
    this.Messages.set(id, {
      ...this.Messages.get(id),
      status,
      result,
    } as UnapprovedMessage);
  }

  async updateUnapprovedTransaction({ status, id, result }) {
    this.Transactions.set(id, {
      ...this.Messages.get(id),
      status,
      txHash: result,
    } as UnapprovedTransaction);
  }
}

export default TransactionStore;
