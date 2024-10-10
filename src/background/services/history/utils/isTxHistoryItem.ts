import { TxHistoryItem } from '../models';

export function isTxHistoryItem(tx: TxHistoryItem): tx is TxHistoryItem {
  if ('bridgeAnalysis' in tx && tx.vmType !== 'AVM' && tx.vmType !== 'PVM') {
    return true;
  }
  return false;
}

export function isPchainTxHistoryItem(tx: TxHistoryItem): tx is TxHistoryItem {
  if (!('vmType' in tx)) {
    return false;
  }
  return tx.vmType === 'PVM';
}
