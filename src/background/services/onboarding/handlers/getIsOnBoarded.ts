import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import { firstValueFrom } from 'rxjs';
import { onboardingState$ } from '../onboardingState';

export async function getIsOnBoarded(request: ExtensionConnectionMessage) {
  const result = await firstValueFrom(onboardingState$);
  return {
    ...request,
    result,
  };
}

export const GetOnboardingStateRequest: [
  ExtensionRequest,
  ConnectionRequestHandler
] = [ExtensionRequest.ONBOARDING_GET_STATE, getIsOnBoarded];
