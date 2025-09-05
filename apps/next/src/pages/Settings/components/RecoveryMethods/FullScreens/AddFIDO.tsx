import {
  AuthErrorCode,
  ExtensionRequest,
  MfaResponseData,
  RecoveryMethodTypes,
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
import { SeedlessNameFidoKey } from '@/pages/Onboarding/flows/SeedlessFlow/screens';
import { KeyType } from '@core/types';

export const AddFIDO = ({ keyType }: { keyType: KeyType }) => {
  const { request } = useConnectionContext();
  const [error, setError] = useState<AuthErrorCode>();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const { initAuthenticatorChange, addFidoDevice } = useSeedlessMfaManager();
  const [step, setStep] = useState<'name' | 'register' | 'verify'>('name');
  const [name, setName] = useState('');

  const [totpChallenge, setTotpChallenge] = useState<TotpResetChallenge>();
  const mfaChallenge = useMFAEvents(setError);
  console.log('mfaChallenge: ', mfaChallenge);
  const [screenState, setScreenState] = useState<AuthenticatorState>(
    AuthenticatorState.Initiated,
  );

  // const [name, setName] = useState('');

  const [code, setCode] = useState('');
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const registerFidoKey = useCallback(async () => {
    try {
      console.log('registerFidoKey name: ', name);
      const result = await addFidoDevice(name, keyType);
      console.log('result: ', result);
      // const challenge = await initAuthenticatorChange();
      // setTotpChallenge(challenge);
      // setScreenState(AuthenticatorState.Pending);
    } catch (e) {
      console.log('e: ', e);
      // setTotpChallenge(undefined);
      setScreenState(AuthenticatorState.Failure);
    }
  }, [addFidoDevice, keyType, name]);

  useEffect(() => {
    registerFidoKey(name);
  }, [name, registerFidoKey]);

  return (
    <Stack>
      {isLoading && <InProgress textSize="body1" />}
      {!name && (
        <SeedlessNameFidoKey
          keyType={keyType}
          onNext={(preferredName) => {
            setStep('register');
            setName(preferredName);
            // registerFidoKey();
          }}
        />
      )}
      {step === 'register' && <MFA fullscreen />}

      {screenState === AuthenticatorState.Failure && (
        <div>Error occurred. Please try again.</div>
      )}
    </Stack>
  );
};
