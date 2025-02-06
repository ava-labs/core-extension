import type { BridgeTransaction } from '@avalabs/core-bridge-sdk';
import type { BridgeTransfer } from '@avalabs/bridge-unified';
import type { TxHistoryItem } from '@src/background/services/history/models';

export const ETHEREUM_ADDRESS = '0x0000000000000000000000000000000000000000';

export function isPendingBridgeTransaction(
  item: TxHistoryItem | BridgeTransaction | BridgeTransfer,
): item is BridgeTransaction | BridgeTransfer {
  return 'addressBTC' in item || 'sourceChain' in item;
}
