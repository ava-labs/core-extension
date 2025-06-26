import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, TextField, useTheme } from '@avalabs/k2-alpine';

import {
  OnboardingStepActions,
  OnboardingStepContent,
  OnboardingStepDescription,
  OnboardingStepTitle,
} from '@/components/OnboardingModal';
import { AuthErrorCode } from '@core/types';
import { useTotpErrorMessage } from '@core/ui';

type AuthenticatorVerificationProps = {
  onSubmit: (code: string) => void;
  isLoading: boolean;
  error?: AuthErrorCode;
};

export const AuthenticatorVerifyCode: FC<AuthenticatorVerificationProps> = ({
  onSubmit,
  isLoading,
  error,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [code, setCode] = useState<string>('');
  const totpError = useTotpErrorMessage(error);

  return (
    <>
      <OnboardingStepTitle>{t(`Verify code`)}</OnboardingStepTitle>
      <OnboardingStepDescription>
        {t(`Enter the code generated in your authenticator app.`)}
      </OnboardingStepDescription>
      <OnboardingStepContent>
        <TextField
          fullWidth
          autoFocus
          type="tel"
          error={!!totpError}
          helperText={totpError}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onSubmit(code);
            }
          }}
          slotProps={{
            htmlInput: {
              sx: {
                textAlign: 'center',
                py: 4,
                ...theme.typography.h1,
              },
            },
          }}
        />
      </OnboardingStepContent>
      <OnboardingStepActions>
        <Button
          sx={{ minWidth: 150 }}
          disabled={!code}
          loading={isLoading}
          variant="contained"
          color="primary"
          onClick={() => onSubmit(code)}
        >
          {t(`Continue`)}
        </Button>
      </OnboardingStepActions>
    </>
  );
};
