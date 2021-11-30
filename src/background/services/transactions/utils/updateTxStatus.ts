import { Transaction, txStatusUpdate } from '../models';

export function updateTxStatus(update: txStatusUpdate, tx: Transaction) {
  return {
    [`${update.id}`]: {
      ...tx,
      status: update.status,
    },
  };
}

export function updateTxStatusFinalized(
  update: txStatusUpdate,
  tx: Transaction
) {
  return {
    ...tx,
    status: update.status,
    ...(update.result ? { txHash: update.result } : {}),
    ...(update.error ? { error: update.error } : {}),
  };
}
