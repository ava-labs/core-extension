import { formatAndLog } from '@src/background/utils/logging';
import {
  onboardingCurrentPhase,
  onboardingMnemonic,
  onboardingPassword,
  onboardingFlow,
} from './onboardingFlows';
import { onboardingFromStorage } from './storage';

onboardingFromStorage().then((state) =>
  formatAndLog('onboarding state', state)
);

onboardingCurrentPhase.subscribe((phase) =>
  formatAndLog('onboarding phase set', phase)
);
onboardingPassword.subscribe(() =>
  formatAndLog('onboarding password set', true)
);
onboardingMnemonic.subscribe(() =>
  formatAndLog('onboarding mnemonic set', true)
);

onboardingFlow.subscribe(() => formatAndLog('onboarding flow complete', true));
