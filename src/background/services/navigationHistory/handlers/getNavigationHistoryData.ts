import {
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  ExtensionRequestHandler,
} from '@src/background/connections/models';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { NavigationHistoryService } from '../NavigationHistoryService';
import { injectable } from 'tsyringe';
@injectable()
export class GetNavigationHistoryDataHandler
  implements ExtensionRequestHandler
{
  methods = [ExtensionRequest.NAVIGATION_HISTORY_DATA_GET];

  constructor(private navigationHistoryService: NavigationHistoryService) {}

  handle = async (
    request: ExtensionConnectionMessage
  ): Promise<ExtensionConnectionMessageResponse> => {
    try {
      const navigationHistoryData =
        await this.navigationHistoryService.getHistoryData();

      return {
        ...request,
        result: navigationHistoryData ?? {},
      };
    } catch (e) {
      return {
        ...request,
        result: {},
      };
    }
  };
}
