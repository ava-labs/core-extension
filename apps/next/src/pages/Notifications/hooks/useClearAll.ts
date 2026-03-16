import { useCallback } from 'react';

import { useClearTransferHistory } from './useClearTransferHistory';
import { useMarkAllNotificationsAsRead } from './useMarkAllNotificationsAsRead';

/**
 * Hook to clear all notifications (convenience wrapper)
 */
export function useClearAll() {
  const { mutate: clearNotifications, isPending: isClearingNotifications } =
    useMarkAllNotificationsAsRead();
  const { mutate: clearTransferHistory, isPending: isClearingTransferHistory } =
    useClearTransferHistory();

  const clearAll = useCallback(() => {
    clearNotifications();
    clearTransferHistory();
  }, [clearNotifications, clearTransferHistory]);

  return {
    clearAll,
    isClearing: isClearingNotifications || isClearingTransferHistory,
  };
}
