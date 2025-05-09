import { SignUpWithSeedless } from './SignUpWithSeedless';
import { Stack } from '@avalabs/core-k2-components';
import { useOnboardingContext } from '@core/ui';
import { useEffect } from 'react';

export function Welcome() {
  const { resetStates } = useOnboardingContext();

  useEffect(() => {
    resetStates();
  }, [resetStates]);

  return (
    <Stack sx={{ height: '100%' }}>
      <SignUpWithSeedless />
    </Stack>
  );
}
