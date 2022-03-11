import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import { firstValueFrom } from 'rxjs';
import { navigationHistoryData$ } from '../navigationHistory';

export async function getNavigationHistoryData(
  request: ExtensionConnectionMessage
) {
  const navigationHistoryData = await firstValueFrom(navigationHistoryData$);
  return {
    ...request,
    result: navigationHistoryData ?? {},
  };
}

export const GetNavigationHistoryDataStateRequest: [
  ExtensionRequest,
  ConnectionRequestHandler
] = [ExtensionRequest.NAVIGATION_HISTORY_DATA_GET, getNavigationHistoryData];
