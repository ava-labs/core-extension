import { ExtensionConnectionEvent } from '@src/background/connections/models';
import { SubscriptionEvents } from '../models';

export function subscriptionsChangedEventListener(
  evt: ExtensionConnectionEvent<SubscriptionEvents>,
) {
  return evt.name === SubscriptionEvents.SUBSCRIPTIONS_CHANGED_EVENT;
}
