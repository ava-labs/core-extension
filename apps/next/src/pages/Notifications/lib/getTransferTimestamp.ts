import { Transfer } from '@avalabs/fusion-sdk';
import { isCompletedTransfer, isTransferInProgress } from '@core/types';

export function getTransferTimestamp(transfer: Transfer): number {
  if (isCompletedTransfer(transfer)) {
    return transfer.completedAtMs;
  }

  if (isTransferInProgress(transfer) || isCompletedTransfer(transfer)) {
    return transfer.source.startedAtMs;
  }

  return transfer.source?.startedAtMs ?? transfer.failedAtMs;
}
