import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AuthErrorCode } from '@core/types';
import { useTotpErrorMessage } from '@core/ui';

import {
  OnboardingStepActions,
  OnboardingStepContent,
  OnboardingStepDescription,
  OnboardingStepTitle,
} from '@/components/OnboardingModal';
import { NavButton } from '@/pages/Onboarding/components/NavButton';

import { TotpCodeField } from './components/TotpCodeField';

type SeedlessVerifyWithTotpProps = {
  onSubmit: (code: string) => void;
  isLoading: boolean;
  error?: AuthErrorCode;
};

export const SeedlessVerifyWithTotp: FC<SeedlessVerifyWithTotpProps> = ({
  onSubmit,
  isLoading,
  error,
}) => {
  const { t } = useTranslation();
  const [code, setCode] = useState<string>('');

  const [isSubmitted, setIsSubmitted] = useState(false);
  const totpError = useTotpErrorMessage(error);

  return (
    <>
      <OnboardingStepTitle>{t(`Verify code`)}</OnboardingStepTitle>
      <OnboardingStepDescription>
        {t(`Enter the code generated in your authenticator app.`)}
      </OnboardingStepDescription>
      <OnboardingStepContent
        sx={{ overflow: 'visible' }} // do not cut off the field when shaking
      >
        <TotpCodeField
          error={isSubmitted && !!totpError}
          helperText={isSubmitted && totpError}
          onChange={(e) => {
            setCode(e.target.value);
            if (error && !isLoading) {
              setIsSubmitted(false);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setIsSubmitted(true);
              onSubmit(code);
            }
          }}
        />
      </OnboardingStepContent>
      <OnboardingStepActions>
        <NavButton
          disabled={!code}
          loading={isLoading}
          color="primary"
          onClick={() => {
            setIsSubmitted(true);
            onSubmit(code);
          }}
        >
          {t(`Continue`)}
        </NavButton>
      </OnboardingStepActions>
    </>
  );
};
