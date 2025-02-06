import { AppleIcon, Button } from '@avalabs/core-k2-components';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { useOnboardingContext } from '@src/contexts/OnboardingProvider';
import { useTranslation } from 'react-i18next';
import type { SeedlesButton } from './GoogleButton';
import {
  ONBOARDING_EVENT_NAMES,
  OnboardingPhase,
} from '@src/background/services/onboarding/models';
import { authenticateWithApple } from '@src/utils/seedless/authenticateWithApple';
import { SeedlessAuthProvider } from '@src/background/services/wallet/models';
import { useSeedlessActions } from '@src/pages/Onboarding/hooks/useSeedlessActions';

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
