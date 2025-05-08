import { useAnalyticsContext } from '@core/ui';
import { useOnboardingContext } from '@core/ui';
import { useSeedlessActions } from '@core/ui';
import { AppleIcon, Button } from '@avalabs/core-k2-components';
import {
  ONBOARDING_EVENT_NAMES,
  OnboardingPhase,
  SeedlessAuthProvider,
} from '@core/types';
import { authenticateWithApple } from '@core/common';
import { useTranslation } from 'react-i18next';
import { SeedlesButton } from './GoogleButton';

export function AppleButton({ setIsLoading }: SeedlesButton) {
  const { t } = useTranslation();
  const { capture } = useAnalyticsContext();
  const { setOnboardingPhase, setAuthProvider } = useOnboardingContext();
  const { signIn } = useSeedlessActions();

  return (
    <Button
      sx={{ width: '100%' }}
      data-testid="create-wallet-apple-button"
      color="primary"
      size="large"
      startIcon={<AppleIcon size={20} />}
      onClick={() => {
        setOnboardingPhase(OnboardingPhase.SEEDLESS_APPLE);
        capture(ONBOARDING_EVENT_NAMES[OnboardingPhase.SEEDLESS_APPLE]);
        setAuthProvider(SeedlessAuthProvider.Apple);
        signIn({
          setIsLoading,
          getOidcToken: authenticateWithApple,
          provider: SeedlessAuthProvider.Apple,
        });
      }}
    >
      {t('Continue with Apple')}
    </Button>
  );
}
