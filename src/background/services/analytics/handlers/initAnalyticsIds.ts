import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { AnalyticsService } from '../AnalyticsService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.ANALYTICS_INIT_IDS,
  string,
  [storeInStorage: boolean]
>;

@injectable()
export class InitAnalyticsIdsHandler implements HandlerType {
  method = ExtensionRequest.ANALYTICS_INIT_IDS as const;

  constructor(private analyticsService: AnalyticsService) {}

  handle: HandlerType['handle'] = async (request) => {
    const [storeInStorage] = request.params;

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
