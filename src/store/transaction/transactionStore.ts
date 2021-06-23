import { makeAutoObservable, autorun, observable, configure } from 'mobx';
import { persistStore } from '@src/utils/mobx';
import { UnapprovedTransaction, UnapprovedMessage, txParams } from './types';
import { JsonRpcRequest } from 'json-rpc-engine';

class TransactionStore {
  addrX: string = '';
  unapprovedTxs: UnapprovedTransaction[] = [];
  unapprovedMsgs: UnapprovedMessage[] = [];

  constructor() {
    makeAutoObservable(this);
    persistStore(this, ['unapprovedTxs', 'unapprovedMsgs'], 'TransactionStore');
  }

  getUnnapprovedTxById(
    id: string | number | void
  ): UnapprovedTransaction | undefined {
    const match = this.unapprovedTxs.find((x) => {
      return x.id === id;
    });
    return match;
  }

  getUnnaprovedMsgById(
    id: string | number | void
  ): UnapprovedMessage | undefined {
    const match = this.unapprovedMsgs.find((x) => {
      return x.id === id;
    });
    return match;
  }

  removeUnapprovedTransaction(id: string | number) {
    const removedArray: UnapprovedTransaction[] = this.unapprovedTxs.filter(
      (x) => x.id !== id
    );
    this.unapprovedTxs = removedArray;
    return;
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

    this.unapprovedTxs.push(sampleTx);
    return;
  }

  async saveUnapprovedMsg(data: JsonRpcRequest<any>, from: string) {
    const { params } = data;

    const now = new Date().getTime();

    let msgData: UnapprovedMessage = {
      id: data.id,
      from,
      time: now,
      status: 'string',
      msgParams: params[1],
      type: 'eth_signTypedData',
    };

    this.unapprovedMsgs.push(msgData);
    return;
  }
}

export default TransactionStore;
