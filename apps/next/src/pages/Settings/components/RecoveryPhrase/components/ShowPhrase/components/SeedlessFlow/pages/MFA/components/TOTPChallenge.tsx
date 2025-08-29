import {
  FullscreenModalActions,
  FullscreenModalContent,
  FullscreenModalDescription,
  FullscreenModalTitle,
} from '@/components/FullscreenModal';
import { TotpCodeField } from '@/components/TotpCodeField';
import { Button } from '@avalabs/k2-alpine';
import {
  AuthErrorCode,
  ExtensionRequest,
  MfaRequestType,
  MfaResponseData,
} from '@core/types';
import {
  useConnectionContext,
  useKeyboardShortcuts,
  useTotpErrorMessage,
} from '@core/ui';
import { FC, useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SubmitMfaResponseHandler } from '~/services/seedless/handlers/submitMfaResponse';
import { ChallengeComponentProps } from '../../../types';

type Props = ChallengeComponentProps<MfaRequestType.Totp>;

export const TOTPChallenge: FC<Props> = ({ error, challenge, onError }) => {
  const { t } = useTranslation();
  const [code, setCode] = useState('');
  const totpError = useTotpErrorMessage(error);
  const { request } = useConnectionContext();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const keyboardShortcuts = useKeyboardShortcuts({
    Enter: () => submitButtonRef.current?.click(),
  });

  const submit = useCallback(
    (params: MfaResponseData) => {
      setIsVerifying(true);
      onError(undefined);

      try {
        request<SubmitMfaResponseHandler>({
          method: ExtensionRequest.SEEDLESS_SUBMIT_MFA_RESPONSE,
          params: [params],
        });
      } catch {
        onError(AuthErrorCode.TotpVerificationError);
      } finally {
        setIsVerifying(false);
      }
    },
    [onError, request],
  );

  return (
    <>
      <FullscreenModalTitle>{t('Verify Code')}</FullscreenModalTitle>
      <FullscreenModalDescription>
        {t('Enter the code generated from your authenticator app.')}
      </FullscreenModalDescription>
      <FullscreenModalContent
        {...keyboardShortcuts}
        sx={{ overflow: 'visible' }}
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
          variant="contained"
          color="secondary"
          size="large"
          onClick={() => {
            setIsSubmitted(true);
            setIsVerifying(true);
            submit({
              mfaId: challenge.mfaId,
              code,
            });
          }}
          loading={isVerifying}
          disabled={!code || isVerifying}
          fullWidth
        >
          {isVerifying ? t('Verifying...') : t('Verify')}
        </Button>
      </FullscreenModalActions>
    </>
  );
};
