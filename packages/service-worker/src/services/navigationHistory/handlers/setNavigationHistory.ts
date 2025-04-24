import { ExtensionRequest } from '@core/types/src/models';
import { ExtensionRequestHandler } from '../../../connections/models';
import * as H from 'history';
import { injectable } from 'tsyringe';
import { NavigationHistoryState } from '@core/types/src/models';
import { NavigationHistoryService } from '../NavigationHistoryService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.NAVIGATION_HISTORY_SET,
  NavigationHistoryState,
  [newNavigationHistory: H.History<unknown>]
>;

@injectable()
export class SetNavigationHistoryHandler implements HandlerType {
  method = ExtensionRequest.NAVIGATION_HISTORY_SET as const;

  constructor(private navigationHistoryService: NavigationHistoryService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const [newNavigationHistory] = request.params;

    return {
      ...request,
      result:
        await this.navigationHistoryService.setHistory(newNavigationHistory),
    };
  };
}
