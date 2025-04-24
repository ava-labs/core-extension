import { ExtensionConnectionEvent } from '../../../connections/models';
import { AnalyticsState, AnalyticsEvents } from '@core/types/src/models';

export function analyticsStateUpdatedEventListener(
  evt: ExtensionConnectionEvent<AnalyticsState>,
) {
  return evt.name === AnalyticsEvents.ANALYTICS_STATE_UPDATED;
}
