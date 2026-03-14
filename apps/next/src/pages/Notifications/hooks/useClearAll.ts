import { useMarkAllAsRead } from './useMarkAllAsRead';

/**
 * Hook to clear all notifications (convenience wrapper)
 */
export function useClearAll() {
  const { mutate: clearAll, isPending } = useMarkAllAsRead();

  return { clearAll, isClearing: isPending };
}
