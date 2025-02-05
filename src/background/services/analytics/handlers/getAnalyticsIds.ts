import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import type { ExtensionRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import type { AnalyticsService } from '../AnalyticsService';
import type { AnalyticsState } from '../models';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.ANALYTICS_GET_IDS,
  AnalyticsState | undefined
>;

@injectable()
export class GetAnalyticsIdsHandler implements HandlerType {
  method = ExtensionRequest.ANALYTICS_GET_IDS as const;

  constructor(private analyticsService: AnalyticsService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
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
