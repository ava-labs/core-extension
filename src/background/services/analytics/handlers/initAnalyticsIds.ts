import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import { analyticsState$ } from '../analytics';
import { saveAnalyticsStateToStorage } from '../storage';

export async function initAnalyticsIds(request: ExtensionConnectionMessage) {
  const state = {
    deviceId: crypto.randomUUID(),
    userId: crypto.randomUUID(),
  };
  analyticsState$.next(state);

  try {
    await saveAnalyticsStateToStorage(state);
  } catch (e) {
    // saving the key failed, we probly don't have a storage key yet
  }

  return {
    ...request,
    result: true,
  };
}

export const AnalyticsInitIdsRequest: [
  ExtensionRequest,
  ConnectionRequestHandler
] = [ExtensionRequest.ANALYTICS_INIT_IDS, initAnalyticsIds];
