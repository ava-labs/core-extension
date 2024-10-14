import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { AnalyticsService } from '../AnalyticsService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.ANALYTICS_CLEAR_IDS,
  true
>;

@injectable()
export class ClearAnalyticsIdsHandler implements HandlerType {
  method = ExtensionRequest.ANALYTICS_CLEAR_IDS as const;

  constructor(private analyticsService: AnalyticsService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    await this.analyticsService.clearIds();

    return {
      ...request,
      result: true,
    };
  };
}