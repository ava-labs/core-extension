import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import { OnboardingPhase } from '../models';
import {
  onboardingCurrentPhase$,
  onboardingMnemonic$,
} from '../onboardingFlows';

export async function setWalletMnemonic(request: ExtensionConnectionMessage) {
  const params = request.params;

  if (!params) {
    return {
      ...request,
      error: 'params missing from request',
    };
  }

  const mnemonic = params.pop();

  if (!mnemonic) {
    return {
      ...request,
      error: 'mnemonic missing for request',
    };
  }

  onboardingMnemonic$.next(mnemonic);
  return {
    ...request,
    result: true,
  };
}

export const SetOnboardingMnemonicRequest: [
  ExtensionRequest,
  ConnectionRequestHandler
] = [ExtensionRequest.ONBOARDING_SET_MNEMONIC, setWalletMnemonic];
