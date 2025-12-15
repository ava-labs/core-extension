import {
  MfaRequestInfo,
  SignerSession,
  SignerSessionData,
} from '@cubist-labs/cubesigner-sdk';
import { Dispatch, SetStateAction, useCallback, useState } from 'react';

import { Monitoring } from '@core/common';

import { useAnalyticsContext } from '../contexts';
import {
  AuthErrorCode,
  FIDOApiEndpoint,
  MfaRequestType,
  RecoveryMethod,
} from '@core/types';
import {
  getOidcClient,
  getSignerSession,
  getSignerToken,
  launchFidoFlow,
  mapMfasToRecoveryMethods,
  OidcTokenGetter,
  requestOidcAuth,
} from '@core/common';

export enum AuthStep {
  NotInitialized,
  Initialized,
  Complete,
  TotpChallenge,
  FidoChallenge,
  ChooseMfaMethod,
}

export type UseSeedlessAuthOptions = {
  getOidcToken: OidcTokenGetter;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  onSignerTokenObtained: (
    token: SignerSessionData,
    email: string,
    userId: string,
  ) => Promise<void>;
};

export const useSeedlessAuth = ({
  getOidcToken,
  setIsLoading,
  onSignerTokenObtained,
}: UseSeedlessAuthOptions) => {
  const [oidcToken, setOidcToken] = useState('');
  const [step, setStep] = useState(AuthStep.NotInitialized);
  const [session, setSession] = useState<SignerSession>();
  const [mfaId, setMfaId] = useState('');
  const [error, setError] = useState<AuthErrorCode>();
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState<string>();
  const [mfaDeviceName, setMfaDeviceName] = useState('');
  const { capture } = useAnalyticsContext();
  const [methods, setMethods] = useState<RecoveryMethod[]>([]);

  const chooseMfaMethod = useCallback((method: RecoveryMethod) => {
    if (method.type === MfaRequestType.Fido) {
      setStep(AuthStep.FidoChallenge);
      setMfaDeviceName(method.name);
    } else if (method.type === MfaRequestType.Totp) {
      setStep(AuthStep.TotpChallenge);
      setMfaDeviceName('');
    } else {
      setError(AuthErrorCode.UnsupportedMfaMethod);
    }
  }, []);

  const getUserDetails = useCallback(async (idToken) => {
    const client = getOidcClient(idToken);
    const identity = await client.identityProve();
    const mfaMethods = identity.user_info?.configured_mfa ?? [];

    return {
      email: identity.email ?? '',
      userId: identity.identity?.sub,
      mfaMethods,
    };
  }, []);

  const authenticate = useCallback(
    async ({
      expectedEmail,
      expectedUserId,
    }: {
      expectedEmail?: string;
      expectedUserId?: string;
    }) => {
      setStep(AuthStep.Initialized);
      setEmail('');
      setUserId('');
      setIsLoading(true);
      setMfaDeviceName('');

      try {
        const idToken = await getOidcToken();

        if (!idToken) {
          capture('SeedlessLoginFailed');
          setError(AuthErrorCode.FailedToFetchOidcToken);
          return;
        }

        const {
          email: obtainedEmail,
          userId: obtainedUserId,
          mfaMethods,
        } = await getUserDetails(idToken);

        setEmail(obtainedEmail);
        setUserId(obtainedUserId);

        if (!obtainedUserId) {
          setError(AuthErrorCode.MissingUserId);
          return;
        }

        // Old onboardgin process for seedless did not store user ID. The expectedUserId might be missing
        if (expectedUserId && expectedUserId !== obtainedUserId) {
          setError(AuthErrorCode.MismatchingUserId);
          return;
        }

        // If expectedUserId is not available, we need to check if the emails match
        if (
          !expectedUserId &&
          expectedEmail &&
          obtainedEmail !== expectedEmail
        ) {
          setError(AuthErrorCode.MismatchingEmail);
          return;
        }

        setOidcToken(idToken);
        const authResponse = await requestOidcAuth(idToken);

        const requiresMfa = authResponse.requiresMfa();

        if (!requiresMfa) {
          setStep(AuthStep.Complete);
          const token = await getSignerToken(authResponse);
          await onSignerTokenObtained?.(token, obtainedEmail, obtainedUserId);
          return;
        }

        const mfaSessionInfo = authResponse.mfaSessionInfo();

        if (mfaSessionInfo) {
          setMfaId(authResponse.mfaId());
          setSession(await getSignerSession(mfaSessionInfo));

          if (!mfaMethods.length) {
            setError(AuthErrorCode.NoMfaMethodsConfigured);
            return false;
          }

          if (mfaMethods.length === 1) {
            const method = mfaMethods[0]!;

            if (method.type === 'totp') {
              setStep(AuthStep.TotpChallenge);
            } else if (method.type === 'fido') {
              setStep(AuthStep.FidoChallenge);
              setMfaDeviceName(method.name);
            } else {
              setError(AuthErrorCode.UnsupportedMfaMethod);
              return false;
            }
          } else {
            setStep(AuthStep.ChooseMfaMethod);
            setMethods(mfaMethods.map(mapMfasToRecoveryMethods));
          }
        } else {
          setError(AuthErrorCode.NoMfaDetails);
          Monitoring.sentryCaptureException(
            new Error('MFA is required, but no details were provided'),
            Monitoring.SentryExceptionTypes.SEEDLESS,
          );
        }
      } catch (err) {
        setError(AuthErrorCode.UnknownError);
        Monitoring.sentryCaptureException(
          err as Error,
          Monitoring.SentryExceptionTypes.SEEDLESS,
        );
      } finally {
        setIsLoading(false);
      }
    },
    [
      setIsLoading,
      getOidcToken,
      getUserDetails,
      capture,
      onSignerTokenObtained,
    ],
  );

  const verifyTotpCode = useCallback(
    async (totpCode: string) => {
      if (!session) {
        setError(AuthErrorCode.UnknownError);
        Monitoring.sentryCaptureException(
          new Error('Session not carried over from initial authentication'),
          Monitoring.SentryExceptionTypes.SEEDLESS,
        );
        return false;
      }

      setIsLoading(true);
      setError(undefined);

      let status: MfaRequestInfo;

      try {
        status = await session.totpApprove(mfaId, totpCode);

        if (!status.receipt?.confirmation) {
          setError(AuthErrorCode.TotpVerificationError);
          capture(AuthErrorCode.TotpVerificationError);
          setIsLoading(false);
          return false;
        }
      } catch {
        setError(AuthErrorCode.InvalidTotpCode);
        capture(AuthErrorCode.InvalidTotpCode);
        setIsLoading(false);
        return false;
      }

      try {
        const oidcAuthResponse = await requestOidcAuth(oidcToken, {
          mfaOrgId: process.env.SEEDLESS_ORG_ID || '',
          mfaId,
          mfaConf: status.receipt.confirmation,
        });
        const token = await getSignerToken(oidcAuthResponse);

        if (!token) {
          capture('SeedlessAuthenticatorVerificationFailed', {
            method: 'totp',
          });
          return false;
        }

        capture('SeedlessAuthenticatorVerificationSuccess', { method: 'totp' });

        if (!userId) {
          setError(AuthErrorCode.MissingUserId);
          return false;
        }

        await onSignerTokenObtained?.(token, email, userId);
        capture('TotpVaridationSuccess');
        return true;
      } catch (err) {
        capture('SeedlessAuthenticatorVerificationFailed', { method: 'totp' });
        setError(AuthErrorCode.UnknownError);
        Monitoring.sentryCaptureException(
          err as Error,
          Monitoring.SentryExceptionTypes.SEEDLESS,
        );

        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [
      session,
      setIsLoading,
      mfaId,
      capture,
      oidcToken,
      userId,
      onSignerTokenObtained,
      email,
    ],
  );

  const completeFidoChallenge = useCallback(async () => {
    if (!session) {
      setError(AuthErrorCode.UnknownError);
      Monitoring.sentryCaptureException(
        new Error('Session not carried over from initial authentication'),
        Monitoring.SentryExceptionTypes.SEEDLESS,
      );
      return false;
    }

    setIsLoading(true);
    setError(undefined);

    try {
      const challenge = await session.fidoApproveStart(mfaId);

      let mfaInfo: MfaRequestInfo;

      try {
        // prompt the user to tap their FIDO and send the answer back to CubeSigner
        const answer = await launchFidoFlow(
          FIDOApiEndpoint.Authenticate,
          challenge.options,
        );
        mfaInfo = await challenge.answer(answer);
      } catch {
        capture('SeedlessAuthenticatorVerificationFailed', { method: 'fido' });
        setError(AuthErrorCode.FidoChallengeFailed);
        return false;
      }

      // print out the current status of the MFA request and assert that it has been approved
      if (!mfaInfo.receipt) {
        setError(AuthErrorCode.FidoChallengeNotApproved);
        return false;
      }

      // proceed with the MFA approval
      let authResponse = await requestOidcAuth(oidcToken);

      authResponse = await authResponse.signWithMfaApproval({
        mfaId,
        mfaOrgId: process.env.SEEDLESS_ORG_ID || '',
        mfaConf: mfaInfo.receipt.confirmation,
      });

      if (authResponse.requiresMfa()) {
        capture('SeedlessAuthenticatorVerificationFailed', { method: 'fido' });
        setIsLoading(false);
        setError(AuthErrorCode.UnknownError);
        Monitoring.sentryCaptureException(
          new Error('MFA should not be required after approval'),
          Monitoring.SentryExceptionTypes.SEEDLESS,
        );
        return false;
      }

      if (!userId) {
        setError(AuthErrorCode.MissingUserId);
        return false;
      }

      await onSignerTokenObtained?.(
        await getSignerToken(authResponse),
        email,
        userId,
      );
      capture('SeedlessAuthenticatorVerificationSuccess', { method: 'fido' });
      return true;
    } catch (err) {
      capture('SeedlessAuthenticatorVerificationFailed', { method: 'fido' });
      setError(AuthErrorCode.UnknownError);
      Monitoring.sentryCaptureException(
        err as Error,
        Monitoring.SentryExceptionTypes.SEEDLESS,
      );

      return false;
    } finally {
      setIsLoading(false);
    }
  }, [
    capture,
    email,
    mfaId,
    oidcToken,
    onSignerTokenObtained,
    session,
    setIsLoading,
    userId,
  ]);

  return {
    error,
    oidcToken,
    step,
    email,
    methods,
    chooseMfaMethod,
    authenticate,
    verifyTotpCode,
    completeFidoChallenge,
    mfaDeviceName,
  };
};
