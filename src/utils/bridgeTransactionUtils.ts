import { BridgeTransaction } from '@avalabs/bridge-sdk';
import { TxHistoryItem } from '@src/background/services/history/models';

export const ETHEREUM_ADDRESS = '0x0000000000000000000000000000000000000000';

export function isPendingBridgeTransaction(
  item: TxHistoryItem | BridgeTransaction
): item is BridgeTransaction {
  return 'addressBTC' in item;
}
