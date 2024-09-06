import {
  PchainTxHistoryItem,
  TxHistoryItem,
  XchainTxHistoryItem,
} from '../models';

export function isTxHistoryItem(
  tx: TxHistoryItem | PchainTxHistoryItem | XchainTxHistoryItem
): tx is TxHistoryItem {
  if ('vmType' in tx) {
    return false;
  }
  return true;
}

export function isPchainTxHistoryItem(
  tx: TxHistoryItem | PchainTxHistoryItem | XchainTxHistoryItem
): tx is PchainTxHistoryItem {
  if (isTxHistoryItem(tx)) {
    return false;
  }
  return tx.vmType === 'PVM';
}
