import {
  FullscreenModalActions,
  FullscreenModalContent,
  FullscreenModalDescription,
  FullscreenModalTitle,
} from '@/components/FullscreenModal';
import { TotpCodeField } from '@/components/TotpCodeField';
import { Button } from '@avalabs/k2-alpine';
import { MfaRequestType } from '@core/types';
import { useKeyboardShortcuts, useTotpErrorMessage } from '@core/ui';
import { FC, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChallengeComponentProps } from '../../../types';

type Props = ChallengeComponentProps<MfaRequestType.Totp>;

export const TOTPChallenge: FC<Props> = ({ error }) => {
  const { t } = useTranslation();
  const [code, setCode] = useState('');
  const totpError = useTotpErrorMessage(error);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const keyboardShortcuts = useKeyboardShortcuts({
    Enter: () => submitButtonRef.current?.click(),
  });

  return (
    <>
      <FullscreenModalTitle>{t('Verify Code')}</FullscreenModalTitle>
      <FullscreenModalDescription>
        {t('Enter the code generated from your authenticator app.')}
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
          }}
        />
      </FullscreenModalContent>
      <FullscreenModalActions>
        <Button
          ref={submitButtonRef}
          color="primary"
          size="large"
          onClick={() => {
            setIsSubmitted(true);
            setIsVerifying(true);
          }}
          disabled={!code || isVerifying}
          fullWidth
        >
          {isVerifying ? t('Verifying...') : t('Verify')}
        </Button>
      </FullscreenModalActions>
    </>
  );
};
