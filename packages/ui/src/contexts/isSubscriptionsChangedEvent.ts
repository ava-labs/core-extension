import { ExtensionConnectionEvent, SubscriptionEvents } from '@core/types';

export function isSubscriptionsChangedEvent(
  evt: ExtensionConnectionEvent<SubscriptionEvents>,
) {
  return evt.name === SubscriptionEvents.SUBSCRIPTIONS_CHANGED_EVENT;
}
