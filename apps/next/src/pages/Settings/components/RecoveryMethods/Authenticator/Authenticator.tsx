import { Page } from '@/components/Page';
import { toast, Typography } from '@avalabs/k2-alpine';
import { FC, useCallback, useEffect, useMemo } from 'react';
import { TFunction, useTranslation } from 'react-i18next';
import { AuthErrorCode, TotpResetChallenge } from '@core/types';
import { useState } from 'react';
import {
  useSeedlessMfaManager,
  useAnalyticsContext,
  useNavigation,
} from '@core/ui';
import { AuthenticatorVerifyScreen } from './AuthenticatorVerifyScreen';
import { AuthenticatorVerifyCode } from './AuthenticatorVerifyCode';
import { InProgress } from '../../common/InProgress';
import { RecoveryMethodFailure } from '../components/RecoveryMethodFailure';
import { AuthenticatorVerifyTotp } from './AuthenticatorVerifyTotp';
import { useHistory } from 'react-router-dom';

export type AuthenticatorState =
  | 'initial'
  | 'initiated'
  | 'confirm-change'
  | 'confirm-removal'
  | 'pending'
  | 'completing'
  | 'verify-code'
  | 'failure';

const getPageText = (screenState: AuthenticatorState, t: TFunction) => {
  const headline: Partial<Record<AuthenticatorState, string>> = {
    initial: t('Scan QR code'),
    initiated: t('Scan QR code'),
    'verify-code': t('Verify code'),
    failure: t('Something went wrong'),
  };

  const description: Partial<Record<AuthenticatorState, string>> = {
    initial: t('Setting up your authenticator app.'),
    initiated: t(
      'Open any authenticator app and scan the QR code below or enter the code manually',
    ),
    'verify-code': t('Enter the code generated from the authenticator app'),
  };
  return {
    title: headline[screenState],
    description: description[screenState],
  };
};

export const Authenticator: FC = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const { initAuthenticatorChange, completeAuthenticatorChange } =
    useSeedlessMfaManager();
  const { capture } = useAnalyticsContext();
  const [totpChallenge, setTotpChallenge] = useState<TotpResetChallenge>();
  const [showSecret, setShowSecret] = useState(false);
  const [screenState, setScreenState] = useState<AuthenticatorState>('initial');
  const [code, setCode] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<AuthErrorCode>();

  const { goBack } = useNavigation();

  const { title, description } = getPageText(screenState, t);

  useEffect(() => {
    const initChange = async () => {
      capture('ConfigureTotpClicked');
      try {
        const challenge = await initAuthenticatorChange();
        setTotpChallenge(challenge);
        setScreenState('initiated');
      } catch {
        setTotpChallenge(undefined);
        setScreenState('failure');
      }
    };
    initChange();
  }, [initAuthenticatorChange, capture]);

  const totpSecret = useMemo(() => {
    if (!totpChallenge) {
      return '';
    }

    return new URL(totpChallenge.totpUrl).searchParams.get('secret') ?? '';
  }, [totpChallenge]);

  const onCodeSubmit = useCallback(async () => {
    setIsSubmitted(true);
    if (!totpChallenge) {
      setScreenState('failure');
      return;
    }
    try {
      await completeAuthenticatorChange(totpChallenge.totpId, code);
      capture('RecoveryMethodAdded', { method: 'totp' });
      toast.success(t('Authenticator added!'));
      history.push('/settings/recovery-methods');
    } catch (e) {
      setError(e as AuthErrorCode);
    } finally {
      setIsSubmitted(false);
    }
  }, [code, completeAuthenticatorChange, history, t, totpChallenge, capture]);

  return (
    <Page
      title={title}
      withBackButton
      contentProps={{ justifyContent: 'flex-start', alignItems: 'start' }}
      onBack={() => goBack('slide')}
    >
      <Typography variant="caption">{description}</Typography>
      {screenState === 'initial' && <InProgress textSize="body1" />}
      {screenState === 'initiated' && !showSecret && totpChallenge && (
        <AuthenticatorVerifyScreen
          totpChallenge={totpChallenge}
          onNext={() => setScreenState('verify-code')}
          onShowSecret={() => setShowSecret(true)}
        />
      )}
      {screenState === 'initiated' && showSecret && (
        <AuthenticatorVerifyCode
          totpSecret={totpSecret}
          onNext={() => setScreenState('verify-code')}
        />
      )}
      {totpChallenge && screenState === 'verify-code' && (
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
      {screenState === 'failure' && <RecoveryMethodFailure />}
    </Page>
  );
};
