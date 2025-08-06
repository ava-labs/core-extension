import { BridgeTransaction } from '@avalabs/core-bridge-sdk';
import { BridgeTransfer } from '@avalabs/bridge-unified';
import { TxHistoryItem } from '@core/types';

export const ETHEREUM_ADDRESS = '0x0000000000000000000000000000000000000000';
export const BURN_ADDRESS = '0x000000000000000000000000000000000000dEaD';
export const ETHER_ADDRESS =
  '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee' as const;
export const VELORA_ADDRESS =
  '0xDEF171Fe48CF0115B1d80b88dc8eAB59176FEe57' as const;

export function isPendingBridgeTransaction(
  item: TxHistoryItem | BridgeTransaction | BridgeTransfer,
): item is BridgeTransaction | BridgeTransfer {
  return 'addressBTC' in item || 'sourceChain' in item;
}
