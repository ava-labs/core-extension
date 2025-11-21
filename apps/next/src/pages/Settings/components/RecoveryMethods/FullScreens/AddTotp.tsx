import { AuthErrorCode, TotpResetChallenge } from '@core/types';
import { useSeedlessMfaManager, useAnalyticsContext } from '@core/ui';
import { useCallback, useEffect, useRef, useState } from 'react';
import { MFA } from '../../RecoveryPhrase/components/ShowPhrase/components/SeedlessFlow/pages/MFA';
import { Button, Stack, toast } from '@avalabs/k2-alpine';
import { AuthenticatorVerifyTotp } from '../Authenticator/AuthenticatorVerifyTotp';
import { useTranslation } from 'react-i18next';
import {
  FullscreenModalActions,
  FullscreenModalDescription,
  FullscreenModalTitle,
} from '@/components/FullscreenModal';
import { SeedlessTotpQRCode } from '@/pages/Onboarding/flows/SeedlessFlow/screens';
import { RecoveryMethodFailure } from '../components/RecoveryMethodFailure';
import { useHistory } from 'react-router-dom';
import { AuthenticatorState } from '../Authenticator';

export const AddTotp = () => {
  const [error, setError] = useState<AuthErrorCode>();
  const history = useHistory();
  const { t } = useTranslation();
  const { capture } = useAnalyticsContext();

  const { initAuthenticatorChange, completeAuthenticatorChange } =
    useSeedlessMfaManager();

  const [totpChallenge, setTotpChallenge] = useState<TotpResetChallenge>();

  const [screenState, setScreenState] =
    useState<AuthenticatorState>('initiated');

  const [code, setCode] = useState('');

  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const onVerify = useCallback(async () => {
    if (!totpChallenge) {
      return;
    }
    try {
      setIsVerifying(true);
      await completeAuthenticatorChange(totpChallenge.totpId, code);
      capture('RecoveryMethodAdded', { method: 'totp' });
      toast.success(t('Authenticator added!'), {
        duration: Infinity,
      });
      history.push('update-recovery-method');
    } catch (e) {
      setError(e as AuthErrorCode);
    } finally {
      setIsVerifying(false);
    }
  }, [code, completeAuthenticatorChange, history, t, totpChallenge, capture]);

  useEffect(() => {
    const initChange = async () => {
      capture('ConfigureTotpClicked');
      try {
        const challenge = await initAuthenticatorChange();
        setTotpChallenge(challenge);
        setScreenState('pending');
      } catch {
        setTotpChallenge(undefined);
        setScreenState('failure');
      }
    };
    initChange();
  }, [initAuthenticatorChange, capture]);

  return (
    <Stack sx={{ height: '100%' }}>
      {!totpChallenge && <MFA />}
      {screenState === 'pending' && totpChallenge && (
        <SeedlessTotpQRCode
          challengeUrl={totpChallenge?.totpUrl ?? ''}
          onNext={() => setScreenState('verify-code')}
        />
      )}
      {screenState === 'verify-code' && totpChallenge && (
        <>
          <FullscreenModalTitle>{t('Verify Code')}</FullscreenModalTitle>
          <FullscreenModalDescription>
            {t('Enter the code generated from your authenticator app.')}
          </FullscreenModalDescription>
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
      {screenState === 'failure' && <RecoveryMethodFailure />}
    </Stack>
  );
};
