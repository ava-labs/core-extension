import { ExtensionConnectionMessage } from '@src/background/connections/models';
import { onboardingFinalized } from '../onboardingFlows';

export async function setOnboardingFinalized(
  request: ExtensionConnectionMessage
) {
  onboardingFinalized.next(true);

  return {
    ...request,
    result: true,
  };
}
