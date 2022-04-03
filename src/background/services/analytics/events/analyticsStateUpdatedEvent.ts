import { filter, map, OperatorFunction } from 'rxjs';
import { AnalyticsState } from '../models';
import { AnalyticsEvents } from './models';
import { analyticsState$ } from '../analytics';

export function analyticsStateUpdatedEvent() {
  return analyticsState$.pipe(
    filter((value) => value !== undefined) as OperatorFunction<
      AnalyticsState | undefined,
      AnalyticsState
    >,
    map((value) => ({
      name: AnalyticsEvents.ANALYTICS_STATE_UPDATED,
      value,
    }))
  );
}
