import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import { OnboardingPhase } from '../models';
import {
  onboardingCurrentPhase$,
  onboardingPassword$,
  onboardingAccountName$,
} from '../onboardingFlows';

export async function setWalletPasswordAndName(
  request: ExtensionConnectionMessage
) {
  const params = request.params;

  if (!params) {
    return {
      ...request,
      error: 'params missing from request',
    };
  }
  const [password, accountName, isImportFlow] = params;

  if (!password) {
    return {
      ...request,
      error: 'password missing for request',
    };
  }

  onboardingPassword$.next(password);
  onboardingAccountName$.next(accountName || 'Account 1');
  onboardingCurrentPhase$.next(
    isImportFlow ? OnboardingPhase.IMPORT_WALLET : OnboardingPhase.CREATE_WALLET
  );

  return {
    ...request,
    result: true,
  };
}

export const SetOnboardingPasswordRequest: [
  ExtensionRequest,
  ConnectionRequestHandler
] = [
  ExtensionRequest.ONBOARDING_SET_PASSWORD_AND_NAME,
  setWalletPasswordAndName,
];
