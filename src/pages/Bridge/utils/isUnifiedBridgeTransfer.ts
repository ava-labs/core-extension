import type { BridgeTransaction } from '@avalabs/core-bridge-sdk';
import type { BridgeTransfer } from '@avalabs/bridge-unified';

export const isUnifiedBridgeTransfer = (
  transfer?: BridgeTransaction | BridgeTransfer,
): transfer is BridgeTransfer => {
  return transfer !== undefined && 'type' in transfer;
};
