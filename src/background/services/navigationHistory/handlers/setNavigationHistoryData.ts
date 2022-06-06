import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import {
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  ExtensionRequestHandler,
} from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { NavigationHistoryService } from '../NavigationHistoryService';

@injectable()
export class SetNavigationHistoryDataHandler
  implements ExtensionRequestHandler
{
  methods = [ExtensionRequest.NAVIGATION_HISTORY_DATA_SET];

  constructor(private navigationHistoryService: NavigationHistoryService) {}

  handle = async (
    request: ExtensionConnectionMessage
  ): Promise<ExtensionConnectionMessageResponse> => {
    const newData = request.params ? request.params[0] : {};

    await this.navigationHistoryService.setHistoryData(newData);

    return {
      ...request,
      result: newData,
    };
  };
}
