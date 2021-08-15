import { ExtensionConnectionMessage } from '@src/background/connections/models';
import { OnboardingPhase } from '../models';
import { onboardingCurrentPhase } from '../onboardingFlows';

export async function setWalletImportOrCreatePhase(
  request: ExtensionConnectionMessage
) {
  const params = request.params;

  if (!params) {
    return {
      ...request,
      error: new Error('params missing from request'),
    };
  }

  const phase =
    params[0] === OnboardingPhase.CREATE_WALLET
      ? OnboardingPhase.CREATE_WALLET
      : params[0] === OnboardingPhase.IMPORT_WALLET
      ? OnboardingPhase.IMPORT_WALLET
      : undefined;

  if (!phase) {
    return {
      ...request,
      error: new Error('phase incorrect for request'),
    };
  }

  onboardingCurrentPhase.next(phase);

  return {
    ...request,
    result: true,
  };
}
