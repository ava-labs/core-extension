import { Button, Stack } from '@avalabs/core-k2-components';
import { SignerSessionData } from '@cubist-labs/cubesigner-sdk';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useConnectionContext } from '@core/ui';
import { useWalletContext } from '@core/ui';
import { AuthStep, useSeedlessAuth } from '@core/ui';
import { UpdateSignerTokenHandler } from '@core/service-worker';
import { ExtensionRequest, AuthErrorCode } from '@core/types';
import { getOidcTokenProvider } from '@core/common';

import { AuthenticationError } from '@/components/common/seedless/components/AuthenticationError';
import { FIDOChallenge } from '@/components/common/seedless/components/FIDOChallenge';
import { MfaChoicePrompt } from '@/components/common/seedless/components/MfaChoicePrompt';
import { TOTPChallenge } from '@/components/common/seedless/components/TOTPChallenge';
import { WaitingForAuthentication } from '@/components/common/seedless/components/WaitingForAuthentication';

const FATAL_ERRORS = [
  AuthErrorCode.NoMfaDetails,
  AuthErrorCode.UnknownError,
  AuthErrorCode.UnsupportedProvider,
  AuthErrorCode.MismatchingEmail,
  AuthErrorCode.MismatchingUserId,
  AuthErrorCode.MissingUserId,
  AuthErrorCode.FailedToFetchOidcToken,
  AuthErrorCode.NoMfaMethodsConfigured,
  AuthErrorCode.UnsupportedMfaMethod,
];

export const SeedlessAuthPopup = () => {
  const { request } = useConnectionContext();
  const { walletDetails } = useWalletContext();
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);

  const onSignerTokenObtained = useCallback(
    async (token: SignerSessionData, email: string, userId: string) => {
      setIsLoading(true);

      request<UpdateSignerTokenHandler>({
        method: ExtensionRequest.SEEDLESS_UPDATE_SIGNER_TOKEN,
        params: [token, email, userId],
      })
        .then(() => {
          window.close();
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [request],
  );

  const getOidcToken = useMemo(
    () =>
      walletDetails?.authProvider
        ? getOidcTokenProvider(walletDetails?.authProvider)
        : () => Promise.reject(new Error('No auth provider')),
    [walletDetails],
  );

  const {
    authenticate,
    methods,
    chooseMfaMethod,
    verifyTotpCode,
    completeFidoChallenge,
    error,
    step,
    mfaDeviceName,
  } = useSeedlessAuth({
    setIsLoading,
    onSignerTokenObtained,
    getOidcToken,
  });

  useEffect(() => {
    // Initiate authentication once we know what email address or userId to expect
    if (
      (walletDetails?.userEmail || walletDetails?.userId) &&
      step === AuthStep.NotInitialized
    ) {
      authenticate({
        expectedEmail: walletDetails.userEmail,
        expectedUserId: walletDetails.userId,
      });
    }
  }, [authenticate, walletDetails?.userEmail, step, walletDetails?.userId]);

  const isFatalError = error && FATAL_ERRORS.includes(error);

  return (
    <>
      {methods.length > 1 && step === AuthStep.ChooseMfaMethod && (
        <MfaChoicePrompt
          mfaChoice={{ availableMethods: methods }}
          onChosen={chooseMfaMethod}
        />
      )}
      {!isFatalError && step === AuthStep.TotpChallenge && (
        <TOTPChallenge
          error={error}
          isLoading={isLoading}
          onSubmit={verifyTotpCode}
        />
      )}
      {!isFatalError && step === AuthStep.FidoChallenge && (
        <FIDOChallenge
          error={error}
          isLoading={isLoading}
          deviceName={mfaDeviceName}
          completeFidoChallenge={completeFidoChallenge}
        />
      )}
      {!isFatalError && step === AuthStep.Initialized && (
        <WaitingForAuthentication provider={walletDetails?.authProvider} />
      )}
      {isFatalError && (
        <Stack
          sx={{
            height: 1,
            width: 1,
            px: 2,
            py: 2,
          }}
        >
          <Stack
            sx={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}
          >
            <AuthenticationError error={error} />
          </Stack>
          <Button color="primary" size="large" onClick={window.close} fullWidth>
            {t('Close')}
          </Button>
        </Stack>
      )}
    </>
  );
};
