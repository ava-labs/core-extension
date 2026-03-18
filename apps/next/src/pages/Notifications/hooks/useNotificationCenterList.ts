import { useQuery } from '@tanstack/react-query';
import { useConnectionContext } from '@core/ui';
import { BackendNotification, ExtensionRequest } from '@core/types';
import type { GetNotificationCenterList } from '@core/service-worker';

export const NOTIFICATION_CENTER_QUERY_KEY = 'notification-center-list';

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
