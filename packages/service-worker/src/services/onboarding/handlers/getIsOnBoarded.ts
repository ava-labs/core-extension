import { ExtensionRequest } from '../../../connections/extensionConnection/models';
import { ExtensionRequestHandler } from '../../../connections/models';
import { injectable } from 'tsyringe';
import { OnboardingState } from '../models';
import { OnboardingService } from '../OnboardingService';
type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.ONBOARDING_GET_STATE,
  OnboardingState
>;

@injectable()
export class GetIsOnboardedHandler implements HandlerType {
  method = ExtensionRequest.ONBOARDING_GET_STATE as const;

  constructor(private onboardingService: OnboardingService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    return {
      ...request,
      result: await this.onboardingService.getState(),
    };
  };
}
