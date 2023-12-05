import { Dispatch, SetStateAction, useCallback, useState } from 'react';
import {
  CubeSigner,
  MfaRequestInfo,
  SignerSession,
  SignerSessionData,
  SignerSessionManager,
  envs,
} from '@cubist-labs/cubesigner-sdk';

import sentryCaptureException, {
  SentryExceptionTypes,
} from '@src/monitoring/sentryCaptureException';

import { getSignerToken } from '@src/utils/seedless/getSignerToken';
import { loginWithCubeSigner } from '@src/utils/seedless/loginWithCubeSigner';
import { OidcTokenGetter } from '@src/utils/seedless/getOidcTokenProvider';

export enum AuthStep {
  NotInitialized,
  Initialized,
  Complete,
  TotpChallenge,
  FidoChallenge,
}

export enum AuthErrorCode {
  InvalidTotpCode = 'invalid-totp-code',
  TotpVerificationError = 'totp-verification-error',
  NoMfaDetails = 'no-mfa-details',
  UnknownError = 'unknown-error',
  UnsupportedProvider = 'unsupported-provider',
  FailedToFetchOidcToken = 'failed-to-fetch-oidc-token',
  MismatchingEmail = 'mismatching-email',
  UnsupportedMfaMethod = 'unsupported-mfa-method',
  FidoChallengeNotApproved = 'fido-challenge-not-approved',
  FidoChallengeFailed = 'fido-challenge-failed',
  NoMfaMethodsConfigured = 'no-mfa-methods-configured',
}

export type UseSeedlessAuthOptions = {
  getOidcToken: OidcTokenGetter;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  onSignerTokenObtained: (
    token: SignerSessionData,
    email: string
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
  const [mfaDeviceName, setMfaDeviceName] = useState('');

  const getUserDetails = useCallback(async (idToken) => {
    const cubesigner = new CubeSigner({
      orgId: process.env.SEEDLESS_ORG_ID || '',
      env: envs[process.env.CUBESIGNER_ENV || ''],
    });
    const identity = await cubesigner.oidcProveIdentity(
      idToken,
      process.env.SEEDLESS_ORG_ID || ''
    );
    const mfaMethods = identity.user_info?.configured_mfa ?? [];
    const [mfaMethod] = mfaMethods;

    const mfaType = mfaMethod?.type;
    const deviceName = mfaMethod?.type === 'fido' ? mfaMethod.name : '';

    return {
      email: identity.email,
      mfaType,
      deviceName,
    };
  }, []);

  const authenticate = useCallback(
    async (expectedEmail?: string) => {
      setStep(AuthStep.Initialized);
      setEmail('');
      setIsLoading(true);
      setMfaDeviceName('');

      try {
        const idToken = await getOidcToken();

        if (!idToken) {
          setError(AuthErrorCode.FailedToFetchOidcToken);
          return;
        }

        const {
          email: obtainedEmail,
          mfaType,
          deviceName,
        } = await getUserDetails(idToken);

        setEmail(obtainedEmail);

        if (expectedEmail && obtainedEmail !== expectedEmail) {
          setError(AuthErrorCode.MismatchingEmail);
          return;
        }

        setOidcToken(idToken);
        const authResponse = await loginWithCubeSigner(idToken);

        const requiresMfa = authResponse.requiresMfa();

        if (!requiresMfa) {
          setStep(AuthStep.Complete);
          const token = await getSignerToken(authResponse);
          await onSignerTokenObtained?.(token, obtainedEmail);
          return;
        }

        const mfaSessionInfo = authResponse.mfaSessionInfo();

        if (mfaSessionInfo) {
          const manager = await SignerSessionManager.createFromSessionInfo(
            envs[process.env.CUBESIGNER_ENV || ''],
            process.env.SEEDLESS_ORG_ID || '',
            mfaSessionInfo
          );
          setMfaId(authResponse.mfaId());
          setSession(await SignerSession.loadSignerSession(manager.storage));

          if (!mfaType) {
            setError(AuthErrorCode.NoMfaMethodsConfigured);
            return false;
          }

          if (mfaType === 'totp') {
            setStep(AuthStep.TotpChallenge);
          } else if (mfaType === 'fido') {
            setStep(AuthStep.FidoChallenge);
            setMfaDeviceName(deviceName);
          } else {
            setError(AuthErrorCode.UnsupportedMfaMethod);
            return false;
          }
        } else {
          setError(AuthErrorCode.NoMfaDetails);
          sentryCaptureException(
            new Error('MFA is required, but no details were provided'),
            SentryExceptionTypes.SEEDLESS
          );
        }
      } catch (err) {
        setError(AuthErrorCode.UnknownError);
        sentryCaptureException(err as Error, SentryExceptionTypes.SEEDLESS);
      } finally {
        setIsLoading(false);
      }
    },
    [getOidcToken, onSignerTokenObtained, setIsLoading, getUserDetails]
  );

  const verifyTotpCode = useCallback(
    async (totpCode: string) => {
      if (!session) {
        setError(AuthErrorCode.UnknownError);
        sentryCaptureException(
          new Error('Session not carried over from initial authentication'),
          SentryExceptionTypes.SEEDLESS
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
          setIsLoading(false);
          return false;
        }
      } catch {
        setError(AuthErrorCode.InvalidTotpCode);
        setIsLoading(false);
        return false;
      }

      try {
        const oidcAuthResponse = await loginWithCubeSigner(oidcToken, {
          mfaOrgId: process.env.SEEDLESS_ORG_ID || '',
          mfaId,
          mfaConf: status.receipt.confirmation,
        });
        const token = await getSignerToken(oidcAuthResponse);

        if (!token) {
          return false;
        }

        await onSignerTokenObtained?.(token, email);

        return true;
      } catch (err) {
        setError(AuthErrorCode.UnknownError);
        sentryCaptureException(err as Error, SentryExceptionTypes.SEEDLESS);

        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [mfaId, oidcToken, session, onSignerTokenObtained, setIsLoading, email]
  );

  const completeFidoChallenge = useCallback(async () => {
    if (!session) {
      setError(AuthErrorCode.UnknownError);
      sentryCaptureException(
        new Error('Session not carried over from initial authentication'),
        SentryExceptionTypes.SEEDLESS
      );
      return false;
    }

    setIsLoading(true);
    setError(undefined);

    try {
      const challenge = await session.fidoApproveStart(mfaId);

      // Extensions need to leave rpId blank
      // https://chromium.googlesource.com/chromium/src/+/main/content/browser/webauth/origins.md
      delete challenge.options.rpId;

      // prompt the user to tap their FIDO and send the answer back to CubeSigner
      let mfaInfo: MfaRequestInfo;

      try {
        mfaInfo = await challenge.createCredentialAndAnswer();
      } catch {
        setError(AuthErrorCode.FidoChallengeFailed);
        return false;
      }

      // print out the current status of the MFA request and assert that it has been approved
      if (!mfaInfo.receipt) {
        setError(AuthErrorCode.FidoChallengeNotApproved);
        return false;
      }

      // proceed with the MFA approval
      let authResponse = await loginWithCubeSigner(oidcToken);

      authResponse = await authResponse.signWithMfaApproval({
        mfaId,
        mfaOrgId: process.env.SEEDLESS_ORG_ID || '',
        mfaConf: mfaInfo.receipt.confirmation,
      });

      if (authResponse.requiresMfa()) {
        setIsLoading(false);
        setError(AuthErrorCode.UnknownError);
        sentryCaptureException(
          new Error('MFA should not be required after approval'),
          SentryExceptionTypes.SEEDLESS
        );
        return false;
      }

      const signerSessionManager =
        await SignerSessionManager.createFromSessionInfo(
          envs[process.env.CUBESIGNER_ENV || ''],
          process.env.SEEDLESS_ORG_ID || '',
          authResponse.data()
        );

      await onSignerTokenObtained?.(
        await signerSessionManager.storage.retrieve(),
        email
      );
      return true;
    } catch (err) {
      setError(AuthErrorCode.UnknownError);
      sentryCaptureException(err as Error, SentryExceptionTypes.SEEDLESS);

      return false;
    } finally {
      setIsLoading(false);
    }
  }, [email, mfaId, oidcToken, onSignerTokenObtained, session, setIsLoading]);

  return {
    error,
    oidcToken,
    step,
    email,
    authenticate,
    verifyTotpCode,
    completeFidoChallenge,
    mfaDeviceName,
  };
};
