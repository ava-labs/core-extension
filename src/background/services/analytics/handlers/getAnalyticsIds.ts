import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import { firstValueFrom } from 'rxjs';
import { analyticsState$ } from '../analytics';

export async function getAnalyticsIds(request: ExtensionConnectionMessage) {
  const analyticsState = await firstValueFrom(analyticsState$);

  return {
    ...request,
    result: analyticsState,
  };
}

export const AnalyticsGetIdsRequest: [
  ExtensionRequest,
  ConnectionRequestHandler
] = [ExtensionRequest.ANALYTICS_GET_IDS, getAnalyticsIds];
