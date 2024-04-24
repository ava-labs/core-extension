import { PchainTxHistoryItem, TxHistoryItem } from '../models';

export function isTxHistoryItem(
  tx: TxHistoryItem | PchainTxHistoryItem
): tx is TxHistoryItem {
  return Object.keys(tx).includes('tokens');
}
