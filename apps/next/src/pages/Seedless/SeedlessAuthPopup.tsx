import {
  AuthStep,
  useConnectionContext,
  useSeedlessAuth,
  useWalletContext,
} from '@core/ui';
import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { AuthErrorCode, ExtensionRequest } from '@core/types';
import { UpdateSignerTokenHandler } from '~/services/seedless/handlers/updateSignerToken';
import { SignerSessionData } from '@cubist-labs/cubesigner-sdk';
import { getOidcTokenProvider } from '@core/common';
import { WaitingForAuthentication } from '@/components/Seedless/components/WaitingForAuthentication';
import { Button } from '@avalabs/k2-alpine';
import { AuthenticationError } from '@/components/Seedless/components/AuthenticationError';
import { FIDOChallenge } from '@/components/Seedless/components/FIDOChallenge';
import { TOTPChallenge } from '@/components/Seedless/components/TOTPChallenge';
import { MfaChoicePrompt } from '@/components/Seedless/components/MfaChoicePrompt';
import {
  StyledStackContentPopup,
  StyledStackRootPopup,
} from '@/components/Seedless/styled';

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
        <StyledStackRootPopup>
          <StyledStackContentPopup>
            <AuthenticationError error={error} />
          </StyledStackContentPopup>
          <Button color="primary" size="large" onClick={window.close} fullWidth>
            {t('Close')}
          </Button>
        </StyledStackRootPopup>
      )}
    </>
  );
};
