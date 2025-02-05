import type { NetworkVMType } from '@avalabs/vm-module-types';
import type { TxHistoryItem } from '../models';

export function isNonXPHistoryItem(
  tx: TxHistoryItem,
): tx is TxHistoryItem<
  Exclude<NetworkVMType, NetworkVMType.AVM | NetworkVMType.PVM>
> {
  return tx.vmType !== 'AVM' && tx.vmType !== 'PVM';
}

export function isPchainTxHistoryItem(
  tx: TxHistoryItem,
): tx is TxHistoryItem<NetworkVMType.PVM> {
  return tx.vmType === 'PVM';
}
