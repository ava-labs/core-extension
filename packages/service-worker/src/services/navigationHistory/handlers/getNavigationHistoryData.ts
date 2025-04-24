import { ExtensionRequest } from '@core/types/src/models';
import { ExtensionRequestHandler } from '../../../connections/models';
import { injectable } from 'tsyringe';
import { NavigationHistoryDataState } from '@core/types/src/models';
import { NavigationHistoryService } from '../NavigationHistoryService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.NAVIGATION_HISTORY_DATA_GET,
  NavigationHistoryDataState
>;

@injectable()
export class GetNavigationHistoryDataHandler implements HandlerType {
  method = ExtensionRequest.NAVIGATION_HISTORY_DATA_GET as const;

  constructor(private navigationHistoryService: NavigationHistoryService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    try {
      const navigationHistoryData =
        await this.navigationHistoryService.getHistoryData();

      return {
        ...request,
        result: navigationHistoryData ?? {},
      };
    } catch (_err) {
      return {
        ...request,
        result: {},
      };
    }
  };
}
