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

  saveUnapprovedTx(params: txParams, from: string): void {
    const { to, value, gas, gasPrice } = params;

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
        data: '',
        gas: gas,
        gasPrice: gasPrice,
      },
      type: 'standard',
      transactionCategory: 'transfer',
    };

    this.unapprovedTxs.push(sampleTx);
  }
}

export default TransactionStore;
