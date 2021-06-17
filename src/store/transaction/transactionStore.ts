import { makeAutoObservable, autorun, observable, configure } from 'mobx';
import { persistStore } from '@src/utils/mobx';

import { UnapprovedTransaction, txParams } from './types';

class TransactionStore {
  addrX: string = '';
  unapprovedTxs: UnapprovedTransaction[] = [];

  constructor() {
    makeAutoObservable(this);
    persistStore(this, ['unapprovedTxs'], 'TransactionStore');
  }

  async saveUnapprovedTx(params: txParams, from: string) {
    console.log('unapprovedTxs', this.unapprovedTxs);

    const { to, value, gas, gasPrice, data } = params;

    let sampleTx = {
      id: 7786962153682822,
      time: 1623700201,
      status: 'string',
      metamaskNetworkId: '1',
      chainId: '0xa869',
      txParams: {
        from: from,
        to: to,
        value: value,
        data: data,
        gas: gas,
        gasPrice: gasPrice,
      },
      type: 'standard',
      transactionCategory: 'transfer',
    };

    console.log('should have saved sampleTx', sampleTx);

    this.unapprovedTxs.push(sampleTx);
    return;
  }
}

export default TransactionStore;
