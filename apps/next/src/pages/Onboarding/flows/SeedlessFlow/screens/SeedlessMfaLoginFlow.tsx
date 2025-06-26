import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FC, useCallback, useEffect, useState } from 'react';
import {
  CircularProgress,
  Stack,
  toast,
  Typography,
  XIcon,
} from '@avalabs/k2-alpine';
import { SignerSessionData } from '@cubist-labs/cubesigner-sdk';

import { useOnboardingContext, useSeedlessAuth, AuthStep } from '@core/ui';

import { SeedlessLoginChooseMfaMethod } from './SeedlessLoginChooseMfaMethod';
import { AuthenticatorVerifyCode } from './AuthenticatorVerifyCode';

type SeedlessMfaLoginFlowProps = {
  nextScreenPath: string;
};

export const SeedlessMfaLoginFlow: FC<SeedlessMfaLoginFlowProps> = ({
  nextScreenPath,
}) => {
  const { t } = useTranslation();
  const history = useHistory();
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
    error,
    verifyTotpCode,
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
  }, [authenticate, step, nextScreenPath, history]);

  return (
    <>
      {(step === AuthStep.NotInitialized || step === AuthStep.Initialized) && (
        <Stack
          width="100%"
          height="100%"
          justifyContent="center"
          alignItems="center"
        >
          <CircularProgress />
        </Stack>
      )}
      {step === AuthStep.ChooseMfaMethod && (
        <SeedlessLoginChooseMfaMethod
          onMethodChosen={chooseMfaMethod}
          methods={methods}
        />
      )}
      {step === AuthStep.TotpChallenge && (
        <AuthenticatorVerifyCode
          onSubmit={verifyTotpCode}
          isLoading={isLoading}
          error={error}
        />
      )}
      {step === AuthStep.FidoChallenge && (
        <Stack
          width="100%"
          height="100%"
          justifyContent="center"
          alignItems="center"
          gap={3}
        >
          <XIcon color="error.main" size={48} />
          <Typography color="error.main" variant="body1">
            {t('Not implemented yet')}
          </Typography>
        </Stack>
      )}
    </>
  );
};
