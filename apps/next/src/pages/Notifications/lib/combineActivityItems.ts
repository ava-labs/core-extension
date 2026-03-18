import { Transfer } from '@avalabs/fusion-sdk';
import { BridgeTransfer } from '@avalabs/bridge-unified';
import { AppNotification } from '@core/types';

import { getTransferTimestamp } from './getTransferTimestamp';
import { CombinedActivityItem } from '../types';
import { getLegacyTransferTimestamp } from './getLegacyTransferTimestamp';
import { isInProgress, isTransferItem } from './type-guards';

export const combineActivityItems = (
  notifications: AppNotification[],
  transfers: Transfer[],
  legacyBridgeTransfers: BridgeTransfer[],
): CombinedActivityItem[] => {
  const notificationItems = notifications.map((n) => ({
    type: 'notification' as const,
    item: n,
    timestamp: n.timestamp,
    id: n.id,
  }));
  const transferItems = transfers.map((transfer) => ({
    type: 'transfer' as const,
    item: transfer,
    timestamp: getTransferTimestamp(transfer),
    id: transfer.id,
  }));
  const legacyBridgeTransferItems = legacyBridgeTransfers.map((transfer) => ({
    type: 'legacy-transfer' as const,
    item: transfer,
    timestamp: getLegacyTransferTimestamp(transfer),
    id: transfer.sourceTxHash,
  }));

  return [
    ...notificationItems,
    ...transferItems,
    ...legacyBridgeTransferItems,
  ].sort((a, b) => {
    const aIsPendingTransfer = isTransferItem(a) && isInProgress(a);
    const bIsPendingTransfer = isTransferItem(b) && isInProgress(b);

    // Pull pending transfers to the top.
    if (aIsPendingTransfer && !bIsPendingTransfer) {
      return -1;
    }

    if (bIsPendingTransfer && !aIsPendingTransfer) {
      return 1;
    }

    return b.timestamp - a.timestamp;
  });
};
