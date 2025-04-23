import { Dispatch, SetStateAction } from 'react';
import { GoogleColorIcon, Button } from '@avalabs/core-k2-components';
import {
  ONBOARDING_EVENT_NAMES,
  OnboardingPhase,
} from '@core/service-worker';
import { useOnboardingContext } from '@src/contexts/OnboardingProvider';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { useTranslation } from 'react-i18next';
import { useSeedlessActions } from 'packages/ui/pages/Onboarding/hooks/useSeedlessActions';
import { SeedlessAuthProvider } from '@core/service-worker';
import { authenticateWithGoogle } from '@core/utils';

export interface SeedlesButton {
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

export function GoogleButton({ setIsLoading }: SeedlesButton) {
  const { capture } = useAnalyticsContext();
  const { setOnboardingPhase, setAuthProvider } = useOnboardingContext();
  const { t } = useTranslation();
  const { signIn } = useSeedlessActions();

  return (
    <Button
      sx={{ width: '100%' }}
      data-testid="create-wallet-google-button"
      color="primary"
      size="large"
      startIcon={<GoogleColorIcon size={20} />}
      onClick={() => {
        setOnboardingPhase(OnboardingPhase.SEEDLESS_GOOGLE);
        capture(ONBOARDING_EVENT_NAMES.seedless_google);
        setAuthProvider(SeedlessAuthProvider.Google);
        signIn({
          setIsLoading,
          getOidcToken: authenticateWithGoogle,
          provider: SeedlessAuthProvider.Google,
        });
      }}
    >
      {t('Continue with Google')}
    </Button>
  );
}
