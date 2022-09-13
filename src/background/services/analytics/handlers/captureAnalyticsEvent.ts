import { FeatureGates } from '@avalabs/posthog-sdk';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { FeatureFlagService } from '../../featureFlags/FeatureFlagService';
import { AnalyticsServicePosthog } from '../AnalyticsServicePosthog';
import { AnalyticsCapturedEvent } from '../models';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.ANALYTICS_CAPTURE_EVENT,
  null,
  [event: AnalyticsCapturedEvent]
>;

@injectable()
export class CaptureAnalyticsEventHandler implements HandlerType {
  method = ExtensionRequest.ANALYTICS_CAPTURE_EVENT as const;

  constructor(
    private analyticsServicePosthog: AnalyticsServicePosthog,
    private featureFlagService: FeatureFlagService
  ) {}

  handle: HandlerType['handle'] = async (request) => {
    if (!this.featureFlagService.featureFlags[FeatureGates.EVENTS]) {
      return {
        ...request,
        result: null,
      };
    }

    try {
      await this.analyticsServicePosthog.captureEvent(request.params[0]);

      return {
        ...request,
        result: null,
      };
    } catch (e: any) {
      return {
        ...request,
        error: e.toString(),
      };
    }
  };
}
