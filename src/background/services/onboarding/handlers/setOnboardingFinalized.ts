import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import { onboardingFinalized$ } from '../onboardingFlows';

export async function setOnboardingFinalized(
  request: ExtensionConnectionMessage
) {
  onboardingFinalized$.next(true);

  return {
    ...request,
    result: true,
  };
}

export const SetOnboardingFinalizedRequest: [
  ExtensionRequest,
  ConnectionRequestHandler
] = [ExtensionRequest.ONBOARDING_SET_FINALIZED, setOnboardingFinalized];
