import { useHistory } from 'react-router-dom';
import { FC, useCallback, useEffect, useState } from 'react';

import { AuthErrorCode } from '@core/types';
import { useSeedlessActions } from '@core/ui';

import { SEEDLESS_ACTIONS_OPTIONS } from '@/pages/Onboarding/config';

import { SeedlessTotpQRCode, SeedlessVerifyWithTotp } from '../screens';

type SeedlessTotpSetupFlowProps = {
  nextScreenPath: string;
};

type SeedlessTotpSetupStep = 'scan' | 'verify';

export const SeedlessTotpSetupFlow: FC<SeedlessTotpSetupFlowProps> = ({
  nextScreenPath,
}) => {
  const history = useHistory();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<AuthErrorCode>();
  const [step, setStep] = useState<SeedlessTotpSetupStep>('scan');

  const { registerTOTPStart, totpChallenge, verifyRegistrationCode } =
    useSeedlessActions({
      ...SEEDLESS_ACTIONS_OPTIONS,
      preferErrorCode: true,
      onError: setError,
    });

  useEffect(() => {
    if (step === 'scan') {
      registerTOTPStart();
    }
  }, [step, registerTOTPStart]);

  const verifyCode = useCallback(
    async (code: string) => {
      setError(undefined);
      setIsLoading(true);

      try {
        const isVerified = await verifyRegistrationCode(code);

        if (isVerified) {
          history.push(nextScreenPath);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [verifyRegistrationCode, history, nextScreenPath],
  );

  return (
    <>
      {step === 'scan' && (
        <SeedlessTotpQRCode
          challengeUrl={totpChallenge?.totpUrl ?? ''}
          onNext={() => setStep('verify')}
        />
      )}
      {step === 'verify' && (
        <SeedlessVerifyWithTotp
          onSubmit={verifyCode}
          isLoading={isLoading}
          error={error}
        />
      )}
    </>
  );
};
