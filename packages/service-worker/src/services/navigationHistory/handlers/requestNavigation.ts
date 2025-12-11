import { ExtensionRequest, ExtensionRequestHandler } from '@core/types';
import { injectable } from 'tsyringe';
import { NavigationHistoryService } from '../NavigationHistoryService';
type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.NAVIGATION_HISTORY_REQUEST_NAVIGATION,
  true,
  { pathname: string; search?: string }
>;

@injectable()
export class RequestNavigationHandler implements HandlerType {
  method = ExtensionRequest.NAVIGATION_HISTORY_REQUEST_NAVIGATION as const;

  constructor(private navigationHistoryService: NavigationHistoryService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    this.navigationHistoryService.requestNavigation(
      request.params.pathname,
      request.params.search,
    );
    return {
      ...request,
      result: true,
    };
  };
}
