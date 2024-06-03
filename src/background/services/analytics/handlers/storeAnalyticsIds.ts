import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { AnalyticsService } from '../AnalyticsService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.ANALYTICS_STORE_IDS,
  string
>;

@injectable()
export class StoreAnalyticsIdsHandler implements HandlerType {
  method = ExtensionRequest.ANALYTICS_STORE_IDS as const;

  constructor(private analyticsService: AnalyticsService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
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
