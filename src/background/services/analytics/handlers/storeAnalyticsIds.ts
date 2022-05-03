import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import {
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  ExtensionRequestHandler,
} from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { AnalyticsService } from '../AnalyticsService';

@injectable()
export class StoreAnalyticsIdsHandler implements ExtensionRequestHandler {
  methods = [ExtensionRequest.ANALYTICS_STORE_IDS];

  constructor(private analyticsService: AnalyticsService) {}

  handle = async (
    request: ExtensionConnectionMessage
  ): Promise<ExtensionConnectionMessageResponse> => {
    try {
      await this.analyticsService.saveTemporaryAnalyticsIds();
    } catch (e: any) {
      return {
        ...request,
        result: e.toString(),
      };
    }

    return {
      ...request,
      result: true,
    };
  };
}
