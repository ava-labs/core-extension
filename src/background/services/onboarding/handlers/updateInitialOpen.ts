import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import { firstValueFrom } from 'rxjs';
import { OnboardingState } from '@src/background/services/onboarding/models';
import { onboardingStatus$ } from '@src/background/services/onboarding/onboardingFlows';
import { saveInitialOpenToStorage } from '@src/background/services/onboarding/storage';

export async function updateInitialOpen(request: ExtensionConnectionMessage) {
  const onboardingStatus = await firstValueFrom(onboardingStatus$);
  const isInitialOpen = false;

  let updatedOnboardingStatus: OnboardingState | undefined;

  if (onboardingStatus) {
    updatedOnboardingStatus = {
      ...onboardingStatus,
      initialOpen: isInitialOpen,
    };
  }

  await saveInitialOpenToStorage(isInitialOpen);

  updatedOnboardingStatus && onboardingStatus$.next(updatedOnboardingStatus);

  return {
    ...request,
    result: true,
  };
}

export const InitialWalletOpenRequest: [
  ExtensionRequest,
  ConnectionRequestHandler
] = [ExtensionRequest.ONBOARDING_INITIAL_WALLET_OPEN, updateInitialOpen];
