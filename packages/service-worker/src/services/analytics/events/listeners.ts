import {
  AnalyticsEvents,
  AnalyticsState,
  ExtensionConnectionEvent,
} from '@core/types';

export function analyticsStateUpdatedEventListener(
  evt: ExtensionConnectionEvent<AnalyticsState>,
) {
  return evt.name === AnalyticsEvents.ANALYTICS_STATE_UPDATED;
}
