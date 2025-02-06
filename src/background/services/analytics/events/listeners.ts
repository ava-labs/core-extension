import type { ExtensionConnectionEvent } from '@src/background/connections/models';
import type { AnalyticsState } from '../models';
import { AnalyticsEvents } from '../models';

export function analyticsStateUpdatedEventListener(
  evt: ExtensionConnectionEvent<AnalyticsState>,
) {
  return evt.name === AnalyticsEvents.ANALYTICS_STATE_UPDATED;
}
