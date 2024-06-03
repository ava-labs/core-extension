import { FeatureFlagService } from './../FeatureFlagService';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { FeatureGates } from '../models';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.FEATURE_FLAGS_GET,
  Record<FeatureGates, boolean>
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
