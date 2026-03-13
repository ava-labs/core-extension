import { Transfer } from '@avalabs/fusion-sdk';
import { AppNotification, isTransferInProgress } from '@core/types';

import { getTransferTimestamp } from './getTransferTimestamp';
import { CombinedActivityItem } from '../types';

export const combineActivityItems = (
  notifications: AppNotification[],
  transfers: Transfer[],
): CombinedActivityItem[] => {
  const notificationItems = notifications.map((n) => ({
    type: 'notification' as const,
    item: n,
    timestamp: n.timestamp,
  }));
  const transferItems = transfers.map((transfer) => ({
    type: 'transfer' as const,
    item: transfer,
    timestamp: getTransferTimestamp(transfer),
  }));

  return [...notificationItems, ...transferItems].sort((a, b) => {
    // Pull pending transfers to the top.
    if (
      a.type === 'transfer' &&
      a.type !== b.type &&
      isTransferInProgress(a.item)
    ) {
      return -1;
    }

    if (
      b.type === 'transfer' &&
      b.type !== a.type &&
      isTransferInProgress(b.item)
    ) {
      return 1;
    }
    return b.timestamp - a.timestamp;
  });
};
