import { BridgeTransaction } from '@avalabs/core-bridge-sdk';
import { BridgeTransfer } from '@avalabs/bridge-unified';

export const isUnifiedBridgeTransfer = (
  transfer?: BridgeTransaction | BridgeTransfer
): transfer is BridgeTransfer => {
  return transfer !== undefined && 'type' in transfer;
};
