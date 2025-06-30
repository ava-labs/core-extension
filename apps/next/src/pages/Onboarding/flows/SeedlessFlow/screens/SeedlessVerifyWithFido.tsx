import { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  CircularProgress,
  Stack,
  Typography,
} from '@avalabs/k2-alpine';
import { FiAlertCircle } from 'react-icons/fi';
import { useFidoErrorMessage } from '@core/ui';

import { AuthErrorCode } from '@core/types';

import {
  OnboardingStepActions,
  OnboardingStepContent,
  OnboardingStepDescription,
  OnboardingStepTitle,
} from '@/components/OnboardingModal';
import { NavButton } from '@/pages/Onboarding/components/NavButton';

type SeedlessVerifyWithFidoProps = {
  isLoading: boolean;
  login: () => Promise<boolean>;
  name: string;
  error?: AuthErrorCode;
};

export const SeedlessVerifyWithFido: FC<SeedlessVerifyWithFidoProps> = ({
  error,
  isLoading,
  login,
  name,
}) => {
  const { t } = useTranslation();

  const fidoError = useFidoErrorMessage(error);

  useEffect(() => {
    login();
  }, [login]);

  return (
    <>
      <OnboardingStepTitle>
        {t(`Verify with {{name}}`, { name })}
      </OnboardingStepTitle>
      <OnboardingStepDescription>
        {t(
          `You may need to enable popups to continue, you can find this setting near the address bar.`,
        )}
      </OnboardingStepDescription>
      <OnboardingStepContent>
        <Stack
          width="100%"
          height="100%"
          justifyContent="center"
          alignItems="center"
        >
          {isLoading && !error && <CircularProgress />}
          {!isLoading && error && (
            <Stack
              gap={2}
              color="error.main"
              textAlign="center"
              alignItems="center"
            >
              <FiAlertCircle size={32} />
              <Stack>
                <Typography variant="subtitle1">
                  {t('Could not connect.')}
                </Typography>
                <Typography variant="subtitle1">{fidoError}</Typography>
              </Stack>
              <Button variant="contained" color="primary" onClick={login}>
                {t('Retry')}
              </Button>
            </Stack>
          )}
        </Stack>
      </OnboardingStepContent>
      <OnboardingStepActions>
        <NavButton
          loading={isLoading}
          color="secondary"
          onClick={() => alert('go back')}
        >
          {t(`Cancel`)}
        </NavButton>
      </OnboardingStepActions>
    </>
  );
};
