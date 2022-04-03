import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import { analyticsState$ } from '../analytics';
import { clearAnalyticsStateFromStorage } from '../storage';

export async function clearAnalyticsIds(request: ExtensionConnectionMessage) {
  analyticsState$.next(undefined);

  await clearAnalyticsStateFromStorage();

  return {
    ...request,
    result: true,
  };
}

export const AnalyticsClearIdsRequest: [
  ExtensionRequest,
  ConnectionRequestHandler
] = [ExtensionRequest.ANALYTICS_CLEAR_IDS, clearAnalyticsIds];
