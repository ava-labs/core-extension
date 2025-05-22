import { ExtensionConnectionEvent, SubscriptionEvents } from '@core/types';

export function isSubscriptionsChangedEvent(
  evt: ExtensionConnectionEvent,
): evt is ExtensionConnectionEvent<SubscriptionEvents> {
  return evt.name === SubscriptionEvents.SUBSCRIPTIONS_CHANGED_EVENT;
}
