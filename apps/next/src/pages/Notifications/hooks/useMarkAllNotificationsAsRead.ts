import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useConnectionContext } from '@core/ui';
import { BackendNotification, ExtensionRequest } from '@core/types';
import type { MarkAllNotificationsAsRead } from '@core/service-worker';
import { NOTIFICATION_CENTER_QUERY_KEY } from './useNotificationCenterList';

/**
 * Hook to mark all notifications as read
 */
export function useMarkAllNotificationsAsRead() {
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
