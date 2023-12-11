import { useFeatureFlagContext } from '@src/contexts/FeatureFlagsProvider';
import { SignUp } from './SignUp';
import { SignUpWithSeedles } from './SignUpWithSeedless';
import { FeatureGates } from '@src/background/services/featureFlags/models';
import { Stack } from '@avalabs/k2-components';
import { useOnboardingContext } from '@src/contexts/OnboardingProvider';
import { useEffect } from 'react';

export function Welcome() {
  const { featureFlags } = useFeatureFlagContext();
  const { resetStates } = useOnboardingContext();

  useEffect(() => {
    resetStates();
  }, [resetStates]);

  const isSeedlessAvailable =
    featureFlags[FeatureGates.SEEDLESS_ONBOARDING] &&
    (featureFlags[FeatureGates.SEEDLESS_ONBOARDING_GOOGLE] ||
      featureFlags[FeatureGates.SEEDLESS_ONBOARDING_APPLE]);

  return (
    <Stack sx={{ top: '15%', position: 'relative' }}>
      {isSeedlessAvailable && <SignUpWithSeedles />}
      {!isSeedlessAvailable && <SignUp />}
    </Stack>
  );
}
