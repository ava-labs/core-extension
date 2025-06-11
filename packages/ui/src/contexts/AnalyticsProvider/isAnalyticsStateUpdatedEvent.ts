import {
  AnalyticsEvents,
  AnalyticsState,
  ExtensionConnectionEvent,
} from '@core/types';

export function isAnalyticsStateUpdatedEvent(
  evt: ExtensionConnectionEvent,
): evt is ExtensionConnectionEvent<AnalyticsState> {
  return evt.name === AnalyticsEvents.ANALYTICS_STATE_UPDATED;
}
