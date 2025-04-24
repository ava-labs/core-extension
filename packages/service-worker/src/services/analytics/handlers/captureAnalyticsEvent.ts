import { ExtensionRequest } from '@core/types/src/models';
import { ExtensionRequestHandler } from '../../../connections/models';
import { injectable } from 'tsyringe';
import { FeatureFlagService } from '../../featureFlags/FeatureFlagService';
import { AnalyticsServicePosthog } from '../AnalyticsServicePosthog';
import { AnalyticsCapturedEvent } from '@core/types/src/models';
import { FeatureGates } from '@core/types';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.ANALYTICS_CAPTURE_EVENT,
  null,
  [event: AnalyticsCapturedEvent, useEncryption?: boolean]
>;

@injectable()
export class CaptureAnalyticsEventHandler implements HandlerType {
  method = ExtensionRequest.ANALYTICS_CAPTURE_EVENT as const;

  constructor(
    private analyticsServicePosthog: AnalyticsServicePosthog,
    private featureFlagService: FeatureFlagService,
  ) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    if (!this.featureFlagService.featureFlags[FeatureGates.EVENTS]) {
      return {
        ...request,
        result: null,
      };
    }

    const [event, useEncryption] = request.params;

    try {
      if (useEncryption) {
        await this.analyticsServicePosthog.captureEncryptedEvent(event);
      } else {
        await this.analyticsServicePosthog.captureEvent(event);
      }

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
