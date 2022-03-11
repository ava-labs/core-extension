import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import { navigationHistoryData$ } from '../navigationHistory';

export async function setNavigationHistoryData(
  request: ExtensionConnectionMessage
) {
  const newData = request.params ? request.params[0] : {};

  navigationHistoryData$.next(newData);

  return {
    ...request,
    result: newData,
  };
}

export const SetNavigationHistoryDataStateRequest: [
  ExtensionRequest,
  ConnectionRequestHandler
] = [ExtensionRequest.NAVIGATION_HISTORY_DATA_SET, setNavigationHistoryData];
