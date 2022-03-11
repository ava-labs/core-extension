import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import { firstValueFrom } from 'rxjs';
import {
  excludedPathNames,
  navigationHistory$,
  navigationHistoryData$,
} from '../navigationHistory';
import * as H from 'history';

export async function setNavigationHistory(
  request: ExtensionConnectionMessage
) {
  const navigationHistory = await firstValueFrom(navigationHistory$);

  if (!request?.params?.length) {
    return { ...request, error: 'history object is missing' };
  }

  const newNavigationHistory: H.History<unknown> = request.params[0];

  if (excludedPathNames.includes(newNavigationHistory.location.pathname)) {
    return {
      ...request,
      result: navigationHistory,
    };
  }

  navigationHistory$.next(request.params[0]);
  navigationHistoryData$.next({});

  return {
    ...request,
    result: newNavigationHistory,
  };
}

export const SetNavigationHistoryStateRequest: [
  ExtensionRequest,
  ConnectionRequestHandler
] = [ExtensionRequest.NAVIGATION_HISTORY_SET, setNavigationHistory];
