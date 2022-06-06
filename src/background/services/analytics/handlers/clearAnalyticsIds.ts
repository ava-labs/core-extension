import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import {
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  ExtensionRequestHandler,
} from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { AnalyticsService } from '../AnalyticsService';

@injectable()
export class ClearAnalyticsIdsHandler implements ExtensionRequestHandler {
  methods = [ExtensionRequest.ANALYTICS_CLEAR_IDS];

  constructor(private analyticsService: AnalyticsService) {}

  handle = async (
    request: ExtensionConnectionMessage
  ): Promise<ExtensionConnectionMessageResponse> => {
    await this.analyticsService.clearIds();

    return {
      ...request,
      result: true,
    };
  };
}
