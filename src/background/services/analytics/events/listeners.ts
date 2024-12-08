import { ExtensionConnectionEvent } from '@src/background/connections/models';
import { AnalyticsState, AnalyticsEvents } from '../models';

export function analyticsStateUpdatedEventListener(
  evt: ExtensionConnectionEvent<AnalyticsState>,
) {
  return evt.name === AnalyticsEvents.ANALYTICS_STATE_UPDATED;
}
