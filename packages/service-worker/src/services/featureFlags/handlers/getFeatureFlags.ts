import { FeatureFlagService } from '../FeatureFlagService';
import {
  ExtensionRequest,
  ExtensionRequestHandler,
  FeatureFlags,
} from '@core/types';
import { injectable } from 'tsyringe';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.FEATURE_FLAGS_GET,
  FeatureFlags
>;

@injectable()
export class GetFeatureFlagsHandler implements HandlerType {
  method = ExtensionRequest.FEATURE_FLAGS_GET as const;

  constructor(private featureFlagService: FeatureFlagService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    try {
      return {
        ...request,
        result: this.featureFlagService.featureFlags,
      };
    } catch (e: any) {
      return {
        ...request,
        error: e.toString(),
      };
    }
  };
}
