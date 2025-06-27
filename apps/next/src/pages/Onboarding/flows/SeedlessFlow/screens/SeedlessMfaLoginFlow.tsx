import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FC, useCallback, useEffect, useState } from 'react';
import { toast } from '@avalabs/k2-alpine';
import { SignerSessionData } from '@cubist-labs/cubesigner-sdk';

import { useOnboardingContext, useSeedlessAuth, AuthStep } from '@core/ui';

import { LoadingScreen } from '@/pages/Onboarding/components/LoadingScreen';
import { useModalPageControl } from '@/components/OnboardingModal';

import { SeedlessVerifyWithFido } from './SeedlessVerifyWithFido';
import { SeedlessVerifyWithTotp } from './SeedlessVerifyWithTotp';
import { SeedlessChooseAuthMethod } from './SeedlessChooseAuthMethod';

type SeedlessMfaLoginFlowProps = {
  nextScreenPath: string;
};

export const SeedlessMfaLoginFlow: FC<SeedlessMfaLoginFlowProps> = ({
  nextScreenPath,
}) => {
  const { t } = useTranslation();
  const history = useHistory();
  const { registerBackButtonHandler } = useModalPageControl();
  const { oidcToken, setSeedlessSignerToken } = useOnboardingContext();
  const [isLoading, setIsLoading] = useState(false);

  const onAuthSuccess = useCallback(
    async (token: SignerSessionData) => {
      setSeedlessSignerToken(token);
      history.push(nextScreenPath);
    },
    [nextScreenPath, history, setSeedlessSignerToken],
  );
  const getOidcToken = useCallback(async () => oidcToken ?? '', [oidcToken]);

  const {
    authenticate,
    step,
    methods,
    chooseMfaMethod,
    mfaDeviceName,
    error,
    verifyTotpCode,
    completeFidoChallenge,
  } = useSeedlessAuth({
    getOidcToken,
    setIsLoading,
    onSignerTokenObtained: onAuthSuccess,
  });

  useEffect(() => {
    if (!oidcToken) {
      toast.error(t('Seedless login error'));
      history.push('/onboarding');
      return;
    }
  }, [history, oidcToken, t]);

  useEffect(() => {
    if (step === AuthStep.NotInitialized) {
      authenticate({});
    }
  }, [authenticate, step]);

  useEffect(() => {
    let callback: () => void;

    switch (step) {
      case AuthStep.FidoChallenge:
      case AuthStep.TotpChallenge:
        callback = () => authenticate({});
        break;
      default:
        callback = history.goBack;
    }
    return registerBackButtonHandler(callback);
  }, [step, registerBackButtonHandler, history.goBack, authenticate]);

  return (
    <>
      {(step === AuthStep.NotInitialized || step === AuthStep.Initialized) && (
        <LoadingScreen />
      )}
      {step === AuthStep.ChooseMfaMethod && (
        <SeedlessChooseAuthMethod
          onMethodChosen={chooseMfaMethod}
          methods={methods}
        />
      )}
      {step === AuthStep.TotpChallenge && (
        <SeedlessVerifyWithTotp
          onSubmit={verifyTotpCode}
          isLoading={isLoading}
          error={error}
        />
      )}
      {step === AuthStep.FidoChallenge && (
        <SeedlessVerifyWithFido
          isLoading={isLoading}
          login={completeFidoChallenge}
          name={mfaDeviceName}
          error={error}
        />
      )}
    </>
  );
};
