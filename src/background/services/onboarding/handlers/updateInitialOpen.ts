import {
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  ExtensionRequestHandler,
} from '@src/background/connections/models';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { OnboardingService } from '../OnboardingService';
import { injectable } from 'tsyringe';
@injectable()
export class UpdateInitialOpenHandler implements ExtensionRequestHandler {
  methods = [ExtensionRequest.ONBOARDING_INITIAL_WALLET_OPEN];

  constructor(private onboardingService: OnboardingService) {}

  handle = async (
    request: ExtensionConnectionMessage
  ): Promise<ExtensionConnectionMessageResponse> => {
    await this.onboardingService.setInitialOpen(false);
    return {
      ...request,
      result: true,
    };
  };
}
