import {
  AuthErrorCode,
  ExtensionRequest,
  MfaResponseData,
  TotpResetChallenge,
} from '@core/types';
import {
  useConnectionContext,
  useSeedlessActions,
  useSeedlessMfaManager,
} from '@core/ui';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useMFAEvents } from '../../RecoveryPhrase/components/ShowPhrase/components/SeedlessFlow/pages/MFA/hooks/useMFAEvent';
import { useMFAChoice } from '../../RecoveryPhrase/components/ShowPhrase/components/SeedlessFlow/pages/MFA/hooks/useMFAChoice';
import { MfaChoicePrompt } from '../../RecoveryPhrase/components/ShowPhrase/components/SeedlessFlow/pages/MFA/components/MfaChoicePrompt';
import { useSelectMFAMethod } from '../../RecoveryPhrase/components/ShowPhrase/components/SeedlessFlow/pages/MFA/hooks/useSelectMFAMethod';
import { MFA } from '../../RecoveryPhrase/components/ShowPhrase/components/SeedlessFlow/pages/MFA';
import { AuthenticatorVerifyScreen } from '../Authenticator/AuthenticatorVerifyScreen';
import { Button, Stack } from '@avalabs/k2-alpine';
import { AuthenticatorVerifyTotp } from '../Authenticator/AuthenticatorVerifyTotp';
import { AuthenticatorState } from '../Authenticator/AuthenticatorDetails';
import { SEEDLESS_ACTIONS_OPTIONS } from '@/pages/Onboarding/config';
import { InProgress } from '../../RecoveryPhrase/components/ShowPhrase/components/InProgress';
import { useTranslation } from 'react-i18next';
import { FullscreenModalActions } from '@/components/FullscreenModal';
import { SubmitMfaResponseHandler } from '~/services/seedless/handlers/submitMfaResponse';
import { CompleteAuthenticatorChangeHandler } from '~/index';

export const AddTotp = () => {
  const { request } = useConnectionContext();
  const [error, setError] = useState<AuthErrorCode>();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const { initAuthenticatorChange, completeAuthenticatorChange } =
    useSeedlessMfaManager();

  const [totpChallenge, setTotpChallenge] = useState<TotpResetChallenge>();
  console.log('totpChallenge: ', totpChallenge);
  const mfaChallenge = useMFAEvents(setError);
  console.log('mfaChallenge: ', mfaChallenge);
  const [screenState, setScreenState] = useState<AuthenticatorState>(
    AuthenticatorState.Initiated,
  );

  const [code, setCode] = useState('');
  console.log('code: ', code);
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const initChange = useCallback(async () => {
    try {
      const challenge = await initAuthenticatorChange();

      setTotpChallenge(challenge);
      setScreenState(AuthenticatorState.Pending);
    } catch (e) {
      setTotpChallenge(undefined);
      setScreenState(AuthenticatorState.Failure);
    }
  }, [initAuthenticatorChange]);

  useEffect(() => {
    initChange();
  }, [initChange]);

  return (
    <Stack>
      {isLoading && <InProgress textSize="body1" />}
      {!totpChallenge && <MFA fullscreen />}
      {screenState === AuthenticatorState.Pending && totpChallenge && (
        <AuthenticatorVerifyScreen
          totpChallenge={totpChallenge}
          onNext={() => setScreenState(AuthenticatorState.VerifyCode)}
        />
      )}
      {screenState === AuthenticatorState.VerifyCode && (
        <>
          <AuthenticatorVerifyTotp
            onChange={(c) => setCode(c)}
            isLoading={isLoading}
            error={error}
          />
          <FullscreenModalActions>
            <Button
              ref={submitButtonRef}
              variant="contained"
              color="secondary"
              size="large"
              onClick={() => {
                setIsSubmitted(true);
                setIsVerifying(true);
                completeAuthenticatorChange(totpChallenge?.totpId, code);
              }}
              loading={isVerifying}
              // disabled={!code || isVerifying}
              fullWidth
            >
              {isVerifying ? t('Verifying...') : t('Verify')}
            </Button>
          </FullscreenModalActions>
        </>
      )}
      {screenState === AuthenticatorState.Failure && (
        <div>Error occurred. Please try again.</div>
      )}
    </Stack>
  );
};
