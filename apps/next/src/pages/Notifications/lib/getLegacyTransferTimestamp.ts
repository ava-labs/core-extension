import { BridgeTransfer } from '@avalabs/bridge-unified';

export function getLegacyTransferTimestamp(transfer: BridgeTransfer): number {
  return transfer.sourceStartedAt;
}
