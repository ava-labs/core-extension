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
  reservedData,
} from '../navigationHistory';
import * as H from 'history';
export { reservedData } from '../navigationHistory';

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

  const navigationHistoryData = await firstValueFrom(navigationHistoryData$);

  navigationHistory$.next(request.params[0]);

  const resetNavigationHistoryData = reservedData.reduce(
    (historyData, dataItem) => {
      if (navigationHistoryData[dataItem]) {
        return {
          ...historyData,
          [dataItem]: navigationHistoryData[dataItem],
        };
      }
      return {
        ...historyData,
      };
    },
    {}
  );
  navigationHistoryData$.next(resetNavigationHistoryData);

  return {
    ...request,
    result: newNavigationHistory,
  };
}

export const SetNavigationHistoryStateRequest: [
  ExtensionRequest,
  ConnectionRequestHandler
] = [ExtensionRequest.NAVIGATION_HISTORY_SET, setNavigationHistory];
