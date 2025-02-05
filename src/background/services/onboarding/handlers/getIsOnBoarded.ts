import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import type { ExtensionRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import type { OnboardingState } from '../models';
import type { OnboardingService } from '../OnboardingService';
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
