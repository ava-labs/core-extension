import { useHistory } from 'react-router-dom';
import { FC, useCallback, useState } from 'react';

import { useSeedlessActions } from '@core/ui';
import { AuthErrorCode, RecoveryMethodTypes } from '@core/types';

import { SEEDLESS_ACTIONS_OPTIONS } from '@/pages/Onboarding/config';

import {
  SeedlessNameFidoKey,
  SeedlessRegisterFidoKey,
  SeedlessVerifyWithFido,
} from '../screens';

type SeedlessFidoSetupFlowProps = {
  nextScreenPath: string;
  keyType: 'passkey' | 'yubikey';
};

type SeedlessFidoSetupFlowStep = 'name' | 'register' | 'verify';

export const SeedlessFidoSetupFlow: FC<SeedlessFidoSetupFlowProps> = ({
  nextScreenPath,
  keyType,
}) => {
  const history = useHistory();

  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState<AuthErrorCode>();
  const [step, setStep] = useState<SeedlessFidoSetupFlowStep>('name');

  const { addFIDODevice, loginWithFIDO } = useSeedlessActions({
    ...SEEDLESS_ACTIONS_OPTIONS,
    preferErrorCode: true,
    onError: setError,
  });

  const registerFidoKey = useCallback(
    async (preferredName: string) => {
      setName(preferredName);
      setIsLoading(true);
      try {
        const isSuccess = await addFIDODevice(
          preferredName,
          keyType as RecoveryMethodTypes,
        );
        if (isSuccess) {
          setStep('verify');
        } else {
          setError(AuthErrorCode.FidoConfigurationError);
        }
      } catch (err) {
        console.error(err);
        setError(AuthErrorCode.FidoConfigurationError);
      } finally {
        setIsLoading(false);
      }
    },
    [addFIDODevice, keyType],
  );

  const verifyFidoKey = useCallback(async () => {
    setIsLoading(true);
    try {
      const isSuccess = await loginWithFIDO();
      if (isSuccess) {
        history.push(nextScreenPath);
        return true;
      } else {
        setError(AuthErrorCode.FidoChallengeFailed);
        return false;
      }
    } catch (err) {
      console.error(err);
      setError(AuthErrorCode.UnknownError);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [loginWithFIDO, nextScreenPath, history]);

  return (
    <>
      {step === 'name' && (
        <SeedlessNameFidoKey
          keyType={keyType}
          onNext={(preferredName) => {
            setStep('register');
            registerFidoKey(preferredName);
          }}
        />
      )}
      {step === 'register' && (
        <SeedlessRegisterFidoKey
          keyType={keyType}
          isLoading={isLoading}
          onRetry={() => registerFidoKey(name)}
          onCancel={history.goBack}
          error={error}
        />
      )}
      {step === 'verify' && (
        <SeedlessVerifyWithFido
          login={verifyFidoKey}
          name={name}
          isLoading={isLoading}
          error={error}
          onCancel={history.goBack}
        />
      )}
    </>
  );
};
