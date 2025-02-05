import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import type { ExtensionRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import type { NavigationHistoryState } from '../models';
import type { NavigationHistoryService } from '../NavigationHistoryService';
type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.NAVIGATION_HISTORY_GET,
  NavigationHistoryState
>;

@injectable()
export class GetNavigationHistoryHandler implements HandlerType {
  method = ExtensionRequest.NAVIGATION_HISTORY_GET as const;

  constructor(private navigationHistoryService: NavigationHistoryService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    try {
      const navigationHistory =
        await this.navigationHistoryService.getHistory();
      return {
        ...request,
        result: navigationHistory,
      };
    } catch (_err) {
      return {
        ...request,
        result: {},
      };
    }
  };
}
