import {
  PchainTxHistoryItem,
  TxHistoryItem,
  XchainTxHistoryItem,
} from '../models';

export function isTxHistoryItem(
  tx: TxHistoryItem | PchainTxHistoryItem | XchainTxHistoryItem
): tx is TxHistoryItem {
  return Object.keys(tx).includes('tokens');
}

export function isPchainTxHistoryItem(
  tx: TxHistoryItem | PchainTxHistoryItem | XchainTxHistoryItem
): tx is PchainTxHistoryItem {
  if (isTxHistoryItem(tx)) {
    return false;
  }
  return tx.vmType === 'PVM';
}
