import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useConnectionContext } from '@core/ui';
import {
  BackendNotification,
  ExtensionRequest,
  NotificationsEvents,
} from '@core/types';
import type { GetNotificationCenterList } from '@core/service-worker';
import { useEffect } from 'react';
import { filter } from 'rxjs';

export const NOTIFICATION_CENTER_QUERY_KEY = 'notification-center-list';

/**
 * Hook to fetch notifications from the service worker
 */
export function useNotificationCenterList() {
  const { request, events } = useConnectionContext();
  const queryClient = useQueryClient();

  useEffect(() => {
    const subscription = events()
      .pipe(
        filter(
          (evt) =>
            evt.name === NotificationsEvents.NOTIFICATION_CENTER_CHANGED_EVENT,
        ),
      )
      .subscribe(() => {
        queryClient.invalidateQueries({
          queryKey: [NOTIFICATION_CENTER_QUERY_KEY],
        });
      });

    return () => subscription.unsubscribe();
  }, [events, queryClient]);

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
