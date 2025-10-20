import { Page } from '@/components/Page';
import { toast, Typography } from '@avalabs/k2-alpine';
import { FC, useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthErrorCode, TotpResetChallenge } from '@core/types';
import { useState } from 'react';
import { useGoBack, useSeedlessMfaManager } from '@core/ui';
import { AuthenticatorVerifyScreen } from './AuthenticatorVerifyScreen';
import { AuthenticatorVerifyCode } from './AuthenticatorVerifyCode';
import { InProgress } from '../../common/InProgress';
import { RecoveryMethodFailure } from '../components/RecoveryMethodFailure';
import { AuthenticatorVerifyTotp } from './AuthenticatorVerifyTotp';
import { useHistory } from 'react-router-dom';

export enum AuthenticatorState {
  Initial = 'initial',
  Initiated = 'initiated',
  ConfirmChange = 'confirm-change',
  ConfirmRemoval = 'confirm-removal',
  Pending = 'pending',
  Completing = 'completing',
  VerifyCode = 'verify-code',
  Failure = 'failure',
}

export const Authenticator: FC = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const { initAuthenticatorChange, completeAuthenticatorChange } =
    useSeedlessMfaManager();
  const [totpChallenge, setTotpChallenge] = useState<TotpResetChallenge>();
  const [showSecret, setShowSecret] = useState(false);
  const [screenState, setScreenState] = useState<AuthenticatorState>(
    AuthenticatorState.Initial,
  );
  const [code, setCode] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<AuthErrorCode>();

  const goBack = useGoBack();

  useEffect(() => {
    const initChange = async () => {
      try {
        const challenge = await initAuthenticatorChange();
        setTotpChallenge(challenge);
        setScreenState(AuthenticatorState.Initiated);
      } catch {
        setTotpChallenge(undefined);
        setScreenState(AuthenticatorState.Failure);
      }
    };
    initChange();
  }, [initAuthenticatorChange]);

  const totpSecret = useMemo(() => {
    if (!totpChallenge) {
      return '';
    }

    return new URL(totpChallenge.totpUrl).searchParams.get('secret') ?? '';
  }, [totpChallenge]);

  const headline = {
    [AuthenticatorState.Initial]: t('Scan QR code'),
    [AuthenticatorState.Initiated]: t('Scan QR code'),
    [AuthenticatorState.VerifyCode]: t('Verify code'),
    [AuthenticatorState.Failure]: t('Something went wrong'),
  };

  const description = {
    [AuthenticatorState.Initial]: t('Setting up your authenticator app.'),
    [AuthenticatorState.Initiated]: t(
      'Open any authenticator app and scan the QR code below or enter the code manually',
    ),
    [AuthenticatorState.VerifyCode]: t(
      'Enter the code generated from the authenticator app',
    ),
  };

  const onCodeSubmit = useCallback(async () => {
    setIsSubmitted(true);
    if (!totpChallenge) {
      setScreenState(AuthenticatorState.Failure);
      return;
    }
    try {
      await completeAuthenticatorChange(totpChallenge.totpId, code);
      toast.success(t('Authenticator added!'));
      history.push('/settings/recovery-methods');
    } catch (e) {
      setError(e as AuthErrorCode);
    } finally {
      setIsSubmitted(false);
    }
  }, [code, completeAuthenticatorChange, history, t, totpChallenge]);

  return (
    <Page
      title={headline[screenState]}
      withBackButton
      contentProps={{ justifyContent: 'flex-start', alignItems: 'start' }}
      onBack={goBack}
    >
      <Typography variant="caption">{description[screenState]}</Typography>
      {screenState === AuthenticatorState.Initial && (
        <InProgress textSize="body1" />
      )}
      {screenState === AuthenticatorState.Initiated &&
        !showSecret &&
        totpChallenge && (
          <AuthenticatorVerifyScreen
            totpChallenge={totpChallenge}
            onNext={() => setScreenState(AuthenticatorState.VerifyCode)}
            onShowSecret={() => setShowSecret(true)}
          />
        )}
      {screenState === AuthenticatorState.Initiated && showSecret && (
        <AuthenticatorVerifyCode
          totpSecret={totpSecret}
          onNext={() => setScreenState(AuthenticatorState.VerifyCode)}
        />
      )}
      {totpChallenge && screenState === AuthenticatorState.VerifyCode && (
        <AuthenticatorVerifyTotp
          onChange={(c) => {
            setCode(c);
            setError(undefined);
          }}
          error={error}
          onSubmit={onCodeSubmit}
          isSubmitted={isSubmitted}
        />
      )}
      {screenState === AuthenticatorState.Failure && <RecoveryMethodFailure />}
    </Page>
  );
};
