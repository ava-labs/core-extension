import {
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  ExtensionRequestHandler,
} from '@src/background/connections/models';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { NavigationHistoryService } from '../NavigationHistoryService';
import { injectable } from 'tsyringe';
@injectable()
export class GetNavigationHistoryHandler implements ExtensionRequestHandler {
  methods = [ExtensionRequest.NAVIGATION_HISTORY_GET];

  constructor(private navigationHistoryService: NavigationHistoryService) {}

  handle = async (
    request: ExtensionConnectionMessage
  ): Promise<ExtensionConnectionMessageResponse> => {
    try {
      const navigationHistory =
        await this.navigationHistoryService.getHistory();
      return {
        ...request,
        result: navigationHistory ?? {},
      };
    } catch (e) {
      return {
        ...request,
        result: {},
      };
    }
  };
}
