import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import {
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  ExtensionRequestHandler,
} from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { AnalyticsService } from '../AnalyticsService';

@injectable()
export class InitAnalyticsIdsHandler implements ExtensionRequestHandler {
  methods = [ExtensionRequest.ANALYTICS_INIT_IDS];

  constructor(private analyticsService: AnalyticsService) {}

  handle = async (
    request: ExtensionConnectionMessage
  ): Promise<ExtensionConnectionMessageResponse> => {
    const { params } = request;
    const [storeInStorage] = params || [];

    try {
      await this.analyticsService.initIds(!!storeInStorage);
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
