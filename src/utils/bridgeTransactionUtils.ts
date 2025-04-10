import { BridgeTransaction } from '@avalabs/core-bridge-sdk';
import { BridgeTransfer } from '@avalabs/bridge-unified';
import { TxHistoryItem } from 'packages/service-worker/src/services/history/models';

export const ETHEREUM_ADDRESS = '0x0000000000000000000000000000000000000000';

export function isPendingBridgeTransaction(
  item: TxHistoryItem | BridgeTransaction | BridgeTransfer,
): item is BridgeTransaction | BridgeTransfer {
  return 'addressBTC' in item || 'sourceChain' in item;
}
