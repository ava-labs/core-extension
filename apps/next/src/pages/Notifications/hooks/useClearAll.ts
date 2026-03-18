import { useCallback } from 'react';

import { useClearTransferHistory } from './useClearTransferHistory';
import { useMarkAllNotificationsAsRead } from './useMarkAllNotificationsAsRead';
import { useClearLegacyTransferHistory } from './useClearLegacyTransferHistory';

/**
 * Hook to clear all notifications (convenience wrapper)
 */
export function useClearAll() {
  const { mutate: clearNotifications, isPending: isClearingNotifications } =
    useMarkAllNotificationsAsRead();
  const { mutate: clearTransferHistory, isPending: isClearingTransferHistory } =
    useClearTransferHistory();
  const {
    mutate: clearLegacyTransfersHistory,
    isPending: isClearingLegacyTransferHistory,
  } = useClearLegacyTransferHistory();

  const clearAll = useCallback(() => {
    clearNotifications();
    clearTransferHistory();
    clearLegacyTransfersHistory();
  }, [clearNotifications, clearTransferHistory, clearLegacyTransfersHistory]);

  return {
    clearAll,
    isClearing:
      isClearingNotifications ||
      isClearingTransferHistory ||
      isClearingLegacyTransferHistory,
  };
}
