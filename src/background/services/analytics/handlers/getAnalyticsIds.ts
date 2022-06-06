import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import {
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  ExtensionRequestHandler,
} from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { AnalyticsService } from '../AnalyticsService';

@injectable()
export class GetAnalyticsIdsHandler implements ExtensionRequestHandler {
  methods = [ExtensionRequest.ANALYTICS_GET_IDS];

  constructor(private analyticsService: AnalyticsService) {}

  handle = async (
    request: ExtensionConnectionMessage
  ): Promise<ExtensionConnectionMessageResponse> => {
    try {
      const analyticsState = await this.analyticsService.getIds();

      return {
        ...request,
        result: analyticsState,
      };
    } catch (e: any) {
      return {
        ...request,
        error: e.toString(),
      };
    }
  };
}
