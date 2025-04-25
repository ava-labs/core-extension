import {
  ExtensionRequest,
  ExtensionRequestHandler,
  NavigationHistoryState,
} from '@core/types';
import * as H from 'history';
import { injectable } from 'tsyringe';
import { NavigationHistoryService } from '../NavigationHistoryService';

export type HandlerType = ExtensionRequestHandler<
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
