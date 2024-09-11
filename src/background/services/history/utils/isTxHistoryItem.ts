import { TxParam } from '@src/pages/Wallet/WalletRecentTxs';
import { TxHistoryItem } from '../models';

export function isTxHistoryItem(tx: TxParam): tx is TxHistoryItem {
  if ('vmType' in tx) {
    return false;
  }
  return true;
}

export function isPchainTxHistoryItem(tx: TxParam): tx is TxHistoryItem {
  if (isTxHistoryItem(tx)) {
    return false;
  }
  return tx.vmType === 'PVM';
}
