import {
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  ExtensionRequestHandler,
} from '@src/background/connections/models';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { OnboardingService } from '../OnboardingService';
import { injectable } from 'tsyringe';
@injectable()
export class GetIsOnboardedHandler implements ExtensionRequestHandler {
  methods = [ExtensionRequest.ONBOARDING_GET_STATE];

  constructor(private onboardingService: OnboardingService) {}

  handle = async (
    request: ExtensionConnectionMessage
  ): Promise<ExtensionConnectionMessageResponse> => {
    return {
      ...request,
      result: await this.onboardingService.getState(),
    };
  };
}
