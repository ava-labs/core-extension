import { UnifiedBridgeState } from '@core/types';

export function isTransactionConfirming(
  txHash: string,
  transfers: UnifiedBridgeState['pendingTransfers'],
) {
  const pendingTransfer = transfers[txHash];
  if (!pendingTransfer) {
    return false;
  }

  const isSourceConfirming =
    pendingTransfer.sourceConfirmationCount <
    pendingTransfer.sourceRequiredConfirmationCount;
  const isTargetConfirming =
    pendingTransfer.targetConfirmationCount <
    pendingTransfer.targetRequiredConfirmationCount;

  return isSourceConfirming || isTargetConfirming;
}
