import { AuthErrorCode, TotpResetChallenge } from '@core/types';
import { useSeedlessMfaManager } from '@core/ui';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useMFAEvents } from '../../RecoveryPhrase/components/ShowPhrase/components/SeedlessFlow/pages/MFA/hooks/useMFAEvent';
import { MFA } from '../../RecoveryPhrase/components/ShowPhrase/components/SeedlessFlow/pages/MFA';
import { Button, Stack, toast } from '@avalabs/k2-alpine';
import { AuthenticatorVerifyTotp } from '../Authenticator/AuthenticatorVerifyTotp';
import { AuthenticatorState } from '../Authenticator/AuthenticatorDetails';
import { InProgress } from '../../RecoveryPhrase/components/ShowPhrase/components/InProgress';
import { useTranslation } from 'react-i18next';
import { FullscreenModalActions } from '@/components/FullscreenModal';
import { SeedlessTotpQRCode } from '@/pages/Onboarding/flows/SeedlessFlow/screens';
import { RecoveryMethodFailure } from '../components/RecoveryMethodFailure';
import { useHistory } from 'react-router-dom';

export const AddTotp = () => {
  const [error, setError] = useState<AuthErrorCode>();
  const history = useHistory();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
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
  const [isVerifying, setIsVerifying] = useState(false);

  const initChange = useCallback(async () => {
    try {
      const challenge = await initAuthenticatorChange();
      setTotpChallenge(challenge);
      setScreenState(AuthenticatorState.Pending);
    } catch {
      setTotpChallenge(undefined);
      setScreenState(AuthenticatorState.Failure);
    }
  }, [initAuthenticatorChange]);

  const onVerify = useCallback(async () => {
    console.log('totpChallenge: ', totpChallenge);
    if (!totpChallenge) {
      return;
    }
    try {
      setIsVerifying(true);
      await completeAuthenticatorChange(totpChallenge.totpId, code);
      toast.success(t('Authenticator added!'), {
        duration: Infinity,
      });
      history.push('update-recovery-method');
    } catch (e) {
      setError(e as AuthErrorCode);
    } finally {
      setIsVerifying(false);
    }
  }, [code, completeAuthenticatorChange, history, t, totpChallenge]);

  useEffect(() => {
    initChange();
    setIsLoading(false);
  }, [initChange]);

  return (
    <Stack sx={{ height: '100%' }}>
      {isLoading && <InProgress textSize="body1" />}
      {!totpChallenge && <MFA fullscreen />}
      {screenState === AuthenticatorState.Pending && totpChallenge && (
        <SeedlessTotpQRCode
          challengeUrl={totpChallenge?.totpUrl ?? ''}
          onNext={() => setScreenState(AuthenticatorState.VerifyCode)}
        />
      )}
      {screenState === AuthenticatorState.VerifyCode && totpChallenge && (
        <>
          <AuthenticatorVerifyTotp
            onChange={(c) => {
              setCode(c);
              setError(undefined);
            }}
            error={error}
          />
          <FullscreenModalActions>
            <Button
              ref={submitButtonRef}
              variant="contained"
              color="primary"
              size="large"
              onClick={onVerify}
              loading={isVerifying}
              disabled={!code || isVerifying}
              fullWidth
            >
              {isVerifying ? t('Verifying...') : t('Verify')}
            </Button>
          </FullscreenModalActions>
        </>
      )}
      {screenState === AuthenticatorState.Failure && <RecoveryMethodFailure />}
    </Stack>
  );
};
