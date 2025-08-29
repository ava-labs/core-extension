import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AuthErrorCode } from '@core/types';
import { useKeyboardShortcuts, useTotpErrorMessage } from '@core/ui';

import {
  FullscreenModalActions,
  FullscreenModalContent,
  FullscreenModalDescription,
  FullscreenModalTitle,
} from '@/components/FullscreenModal';
import { TotpCodeField } from '@/components/TotpCodeField';
import { NavButton } from '@/pages/Onboarding/components/NavButton';

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
  const keyboardShortcuts = useKeyboardShortcuts({
    Enter: () => onSubmit(code),
  });

  return (
    <>
      <FullscreenModalTitle>{t(`Verify code`)}</FullscreenModalTitle>
      <FullscreenModalDescription>
        {t(`Enter the code generated in your authenticator app.`)}
      </FullscreenModalDescription>
      <FullscreenModalContent
        {...keyboardShortcuts}
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
      </FullscreenModalContent>
      <FullscreenModalActions>
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
      </FullscreenModalActions>
    </>
  );
};
