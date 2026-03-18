import { useNotificationCenterList } from '@/pages/Notifications/hooks/useNotificationCenterList';

/**
 * Hook for unread notification count (for bell badge).
 * All notifications returned by the API are unread.
 */
export function useUnreadNotificationsCount(): number {
  const { data: backendNotifications } = useNotificationCenterList();

  return backendNotifications?.length ?? 0;
}
