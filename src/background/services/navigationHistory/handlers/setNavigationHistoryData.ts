import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { NavigationHistoryDataState } from '../models';
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

  handle: HandlerType['handle'] = async (request) => {
    const [newData] = request.params;

    await this.navigationHistoryService.setHistoryData(newData);

    return {
      ...request,
      result: newData,
    };
  };
}
