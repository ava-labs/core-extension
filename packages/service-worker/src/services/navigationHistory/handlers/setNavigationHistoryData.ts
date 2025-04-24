import { ExtensionRequest } from '@core/types';
import { ExtensionRequestHandler } from '../../../connections/models';
import { injectable } from 'tsyringe';
import { NavigationHistoryDataState } from '@core/types';
import { NavigationHistoryService } from '../NavigationHistoryService';

type HandlerType = ExtensionRequestHandler<
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
