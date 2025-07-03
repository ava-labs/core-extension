import { FC } from 'react';
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

type SeedlessRegisterFidoKeyProps = {
  error?: AuthErrorCode;
  isLoading: boolean;
  keyType: 'passkey' | 'yubikey';
  onRetry: () => void;
  onCancel: () => void;
};

export const SeedlessRegisterFidoKey: FC<SeedlessRegisterFidoKeyProps> = ({
  error,
  isLoading,
  keyType,
  onRetry,
  onCancel,
}) => {
  const { t } = useTranslation();
  const fidoError = useFidoErrorMessage(error);
  return (
    <>
      <OnboardingStepTitle>
        {keyType === 'passkey' ? t(`Passkey setup`) : t(`Yubikey setup`)}
      </OnboardingStepTitle>
      <OnboardingStepDescription>
        {t(
          `Follow the instructions in your browser window to add this key to your account.`,
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
              <Button variant="contained" color="primary" onClick={onRetry}>
                {t('Retry')}
              </Button>
            </Stack>
          )}
        </Stack>
      </OnboardingStepContent>
      <OnboardingStepActions>
        <NavButton loading={isLoading} color="secondary" onClick={onCancel}>
          {t(`Cancel`)}
        </NavButton>
      </OnboardingStepActions>
    </>
  );
};
