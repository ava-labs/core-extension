import {
  ExtensionRequest,
  ExtensionRequestHandler,
  AnalyticsState,
} from '@core/types';
import { injectable } from 'tsyringe';
import { AnalyticsService } from '../AnalyticsService';

export type HandlerType = ExtensionRequestHandler<
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
