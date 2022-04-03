import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import { firstValueFrom } from 'rxjs';
import { analyticsState$ } from '../analytics';
import { saveAnalyticsStateToStorage } from '../storage';

export async function storeAnalyticsIds() {
  const state = await firstValueFrom(analyticsState$);

  if (!state) {
    return;
  }

  await saveAnalyticsStateToStorage(state);
}

export async function storeAnalyticsIdsHandler(
  request: ExtensionConnectionMessage
) {
  await storeAnalyticsIds();

  return {
    ...request,
    result: true,
  };
}

export const AnalyticsStoreIdsRequest: [
  ExtensionRequest,
  ConnectionRequestHandler
] = [ExtensionRequest.ANALYTICS_STORE_IDS, storeAnalyticsIdsHandler];
