import {
  ExtensionRequest,
  ExtensionRequestHandler,
  NavigationHistoryDataState,
} from '@core/types';
import { injectable } from 'tsyringe';
import { NavigationHistoryService } from '../NavigationHistoryService';

export type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.NAVIGATION_HISTORY_DATA_SET,
  NavigationHistoryDataState,
  [NavigationHistoryDataState]
>;

@injectable()
export class SetNavigationHistoryDataHandler implements HandlerType {
  method = ExtensionRequest.NAVIGATION_HISTORY_DATA_SET as const;

  constructor(private navigationHistoryService: NavigationHistoryService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const [newData] = request.params;

    await this.navigationHistoryService.setHistoryData(newData);

    return {
      ...request,
      result: newData,
    };
  };
}
