import {
  ExtensionConnectionEvent,
  NotificationsEvents,
  SubscriptionEvents,
} from '@core/types';

/** Subscription list changed locally, or Core Web requested a notification sync (service → extension port). */
export function isNotificationsSyncEvent(evt: ExtensionConnectionEvent) {
  return (
    evt.name === SubscriptionEvents.SUBSCRIPTIONS_CHANGED_EVENT ||
    evt.name === NotificationsEvents.NOTIFICATION_CENTER_CHANGED_EVENT
  );
}
