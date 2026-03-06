import { useMemo } from 'react';
import { AppNotification, NotificationTab, filterByTab } from '@core/types';
import { useNotificationCenterList } from './useNotificationCenterList';

/**
 * Hook to get notifications with tab filtering.
 * All notifications returned by the API are unread.
 */
export function useNotifications(tab: NotificationTab = NotificationTab.ALL) {
  const { data: backendNotifications, isLoading } = useNotificationCenterList();
  const notifications = useMemo(() => {
    const sorted: AppNotification[] = [...(backendNotifications ?? [])].sort(
      (a, b) => b.timestamp - a.timestamp,
    );

    return filterByTab(sorted, tab);
  }, [backendNotifications, tab]);

  return {
    notifications,
    isLoading,
  };
}
