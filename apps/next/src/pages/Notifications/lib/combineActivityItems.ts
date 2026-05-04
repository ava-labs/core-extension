import { Transfer } from '@avalabs/fusion-sdk';
import { AppNotification } from '@core/types';

import { getTransferTimestamp } from './getTransferTimestamp';
import { CombinedActivityItem } from '../types';
import { isInProgress, isTransferItem } from './type-guards';

export const combineActivityItems = (
  notifications: AppNotification[],
  transfers: Transfer[],
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

  return [...notificationItems, ...transferItems].sort((a, b) => {
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
