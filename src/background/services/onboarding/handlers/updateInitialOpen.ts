import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { OnboardingService } from '../OnboardingService';
type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.ONBOARDING_INITIAL_WALLET_OPEN,
  true
>;

@injectable()
export class UpdateInitialOpenHandler implements HandlerType {
  method = ExtensionRequest.ONBOARDING_INITIAL_WALLET_OPEN as const;

  constructor(private onboardingService: OnboardingService) {}

  handle: HandlerType['handle'] = async (request) => {
    await this.onboardingService.setInitialOpen(false);
    return {
      ...request,
      result: true,
    };
  };
}
