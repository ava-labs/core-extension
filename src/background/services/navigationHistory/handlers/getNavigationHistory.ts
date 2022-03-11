import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import { firstValueFrom } from 'rxjs';
import { navigationHistory$ } from '../navigationHistory';

export async function getNavigationHistory(
  request: ExtensionConnectionMessage
) {
  const navigationHistory = await firstValueFrom(navigationHistory$);

  return {
    ...request,
    result: navigationHistory ?? {},
  };
}

export const GetNavigationHistoryStateRequest: [
  ExtensionRequest,
  ConnectionRequestHandler
] = [ExtensionRequest.NAVIGATION_HISTORY_GET, getNavigationHistory];
