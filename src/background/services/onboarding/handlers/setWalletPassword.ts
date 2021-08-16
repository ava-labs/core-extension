import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import { OnboardingPhase } from '../models';
import { onboardingCurrentPhase, onboardingPassword } from '../onboardingFlows';

export async function setWalletPassword(request: ExtensionConnectionMessage) {
  const params = request.params;

  if (!params) {
    return {
      ...request,
      error: new Error('params missing from request'),
    };
  }

  const password = params.pop();

  if (!password) {
    return {
      ...request,
      error: new Error('password missing for request'),
    };
  }

  onboardingPassword.next(password);
  onboardingCurrentPhase.next(OnboardingPhase.CONFIRM);

  return {
    ...request,
    result: true,
  };
}

export const SetOnboardingPasswordRequest: [
  ExtensionRequest,
  ConnectionRequestHandler
] = [ExtensionRequest.ONBOARDING_SET_PASSWORD, setWalletPassword];
