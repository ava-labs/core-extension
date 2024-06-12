import { SignUpWithSeedles } from './SignUpWithSeedless';
import { Stack } from '@avalabs/k2-components';
import { useOnboardingContext } from '@src/contexts/OnboardingProvider';
import { useEffect } from 'react';

export function Welcome() {
  const { resetStates } = useOnboardingContext();

  useEffect(() => {
    resetStates();
  }, [resetStates]);

  return (
    <Stack sx={{ top: '15%', position: 'relative' }}>
      <SignUpWithSeedles />
    </Stack>
  );
}
