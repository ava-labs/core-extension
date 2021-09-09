import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import { OnboardingPhase } from '../models';
import { onboardingCurrentPhase } from '../onboardingFlows';

export async function setWalletImportOrCreatePhase(
  request: ExtensionConnectionMessage
) {
  const params = request.params;

  if (!params) {
    return {
      ...request,
      error: 'params missing from request',
    };
  }

  const phase = Object.values(OnboardingPhase).includes(params[0])
    ? params[0]
    : undefined;

  if (!phase) {
    return {
      ...request,
      error: 'phase incorrect for request',
    };
  }

  onboardingCurrentPhase.next(phase);

  return {
    ...request,
    result: true,
  };
}

export const SetOnboardingPhaseRequest: [
  ExtensionRequest,
  ConnectionRequestHandler
] = [ExtensionRequest.ONBOARDING_SET_PHASE, setWalletImportOrCreatePhase];
