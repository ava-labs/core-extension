import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import {
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  ExtensionRequestHandler,
} from '@src/background/connections/models';
import { NavigationHistoryService } from '../NavigationHistoryService';
import * as H from 'history';
import { injectable } from 'tsyringe';

@injectable()
export class SetNavigationHistoryHandler implements ExtensionRequestHandler {
  methods = [ExtensionRequest.NAVIGATION_HISTORY_SET];

  constructor(private navigationHistoryService: NavigationHistoryService) {}

  handle = async (
    request: ExtensionConnectionMessage
  ): Promise<ExtensionConnectionMessageResponse> => {
    if (!request?.params?.length) {
      return { ...request, error: 'history object is missing' };
    }

    const newNavigationHistory: H.History<unknown> = request.params[0];

    return {
      ...request,
      result: await this.navigationHistoryService.setHistory(
        newNavigationHistory
      ),
    };
  };
}
