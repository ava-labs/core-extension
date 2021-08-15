import { ExtensionConnectionMessage } from '@src/background/connections/models';
import { firstValueFrom } from 'rxjs';
import { onboardingStatus } from '../onboardingFlows';

export async function getIsOnBoarded(request: ExtensionConnectionMessage) {
  const result = await firstValueFrom(onboardingStatus);
  return {
    ...request,
    result,
  };
}
