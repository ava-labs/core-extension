import { Transaction, txParamsUpdate } from '../models';

export function updatePendingTxParams(update: txParamsUpdate, tx: Transaction) {
  return {
    [update.id]: {
      ...tx,
      txParams: {
        ...tx.txParams,
        ...update.params,
      },
    },
  };
}
