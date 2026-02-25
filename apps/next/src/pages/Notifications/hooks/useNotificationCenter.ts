import { useCallback, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useConnectionContext } from '@core/ui';
import {
  AppNotification,
  BackendNotification,
  ExtensionRequest,
  NotificationTab,
  filterByTab,
} from '@core/types';
import type {
  GetNotificationCenterList,
  MarkAllNotificationsAsRead,
} from '@core/service-worker';

const NOTIFICATION_CENTER_QUERY_KEY = 'notification-center-list';

/**
 * Hook to fetch notifications from the service worker
 */
export function useNotificationCenterList() {
  const { request } = useConnectionContext();

  return useQuery<BackendNotification[], Error>({
    queryKey: [NOTIFICATION_CENTER_QUERY_KEY],
    queryFn: async () => {
      const result = await request<GetNotificationCenterList>({
        method: ExtensionRequest.NOTIFICATION_CENTER_GET_LIST,
      });
      return result ?? [];
    },
    staleTime: 1000 * 60,
    refetchInterval: 1000 * 60,
  });
}

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

/**
 * Hook for unread count (for bell badge).
 * All notifications returned by the API are unread.
 */
export function useUnreadCount(): number {
  const { data: backendNotifications } = useNotificationCenterList();

  return backendNotifications?.length ?? 0;
}

/**
 * Hook to mark all notifications as read
 */
export function useMarkAllAsRead() {
  const { request } = useConnectionContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await request<MarkAllNotificationsAsRead>({
        method: ExtensionRequest.NOTIFICATION_CENTER_MARK_ALL_AS_READ,
      });
    },
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: [NOTIFICATION_CENTER_QUERY_KEY],
      });

      const previousData = queryClient.getQueryData<BackendNotification[]>([
        NOTIFICATION_CENTER_QUERY_KEY,
      ]);

      queryClient.setQueryData<BackendNotification[]>(
        [NOTIFICATION_CENTER_QUERY_KEY],
        [],
      );

      return { previousData };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(
          [NOTIFICATION_CENTER_QUERY_KEY],
          context.previousData,
        );
      }
    },
  });
}

/**
 * Hook to clear all notifications (convenience wrapper)
 */
export function useClearAll() {
  const { mutate: markAllAsRead, isPending } = useMarkAllAsRead();

  const clearAll = useCallback(() => {
    markAllAsRead();
  }, [markAllAsRead]);

  return { clearAll, isClearing: isPending };
}
