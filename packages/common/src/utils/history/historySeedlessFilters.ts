import { ExtensionConnectionEvent, NavigationHistoryEvents } from '@core/types';

export function isNavigationHistoryRequestEvent(
  evt: ExtensionConnectionEvent,
): evt is ExtensionConnectionEvent<{ path: string }> {
  return (
    evt?.name ===
    NavigationHistoryEvents.NAVIGATION_HISTORY_REQUEST_NAVIGATION_EVENT
  );
}
