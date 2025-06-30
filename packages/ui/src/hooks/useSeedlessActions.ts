import { useAnalyticsContext } from '../contexts';
import { useFeatureFlagContext } from '../contexts';
import { useOnboardingContext } from '../contexts';
import {
  AuthErrorCode,
  FIDOApiEndpoint,
  FeatureGates,
  KeyType,
  RecoveryMethodTypes,
  SeedlessAuthProvider,
} from '@core/types';
import {
  approveSeedlessRegistration,
  getOidcClient,
  getOrgId,
  getSignerSession,
  getSignerToken,
  launchFidoFlow,
  requestOidcAuth,
  SeedlessRegistartionResult,
} from '@core/common';
import { SignerSession, TotpChallenge } from '@cubist-labs/cubesigner-sdk';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

type OidcTokenGetter = () => Promise<string>;
type GetAuthButtonCallbackOptions = {
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  getOidcToken: OidcTokenGetter;
  provider: SeedlessAuthProvider;
};

const TOTP_ISSUER: string = 'Core';

const recoveryMethodToFidoKeyType = (method: RecoveryMethodTypes): KeyType => {
  switch (method) {
    case RecoveryMethodTypes.PASSKEY:
      return KeyType.Passkey;

    case RecoveryMethodTypes.YUBIKEY:
      return KeyType.Yubikey;

    default:
      throw new Error('Unsupported FIDO device');
  }
};

type UseSeedlessActionsOptions = {
  urls: {
    mfaSetup: string;
    mfaLogin: string;
  };
} & (
  | {
      preferErrorCode: true;
      onError: (errorCode: AuthErrorCode) => void;
    }
  | {
      preferErrorCode?: false;
      onError: (message: string) => void;
    }
);

export function useSeedlessActions({
  onError,
  urls,
  preferErrorCode,
}: UseSeedlessActionsOptions) {
  const { capture } = useAnalyticsContext();
  const {
    setOidcToken,
    setSeedlessSignerToken,
    oidcToken,
    setUserId,
    setIsSeedlessMfaRequired,
    setNewsletterEmail,
  } = useOnboardingContext();
  const history = useHistory();
  const { t } = useTranslation();
  const [totpChallenge, setTotpChallenge] = useState<TotpChallenge>();
  const [mfaSession, setMfaSession] = useState<SignerSession | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const { featureFlags } = useFeatureFlagContext();

  useEffect(() => {
    if (!errorMessage || preferErrorCode) {
      return;
    }
    onError(errorMessage);
  }, [errorMessage, onError, preferErrorCode]);

  const handleOidcToken = useCallback(
    async (idToken) => {
      setOidcToken(idToken);

      const oidcClient = getOidcClient(idToken);
      const identity = await oidcClient.identityProve();

      if (!identity.user_info) {
        const result = await approveSeedlessRegistration(
          identity,
          !featureFlags[FeatureGates.SEEDLESS_OPTIONAL_MFA],
        );

        if (result !== SeedlessRegistartionResult.APPROVED) {
          onError(t('Seedless login error'));
          return;
        }
      } else {
        // If the user already has an account, it's possible that the
        // account was created before we made MFA optional, but the user
        // then resigned from following through (e.g. didn't know how to
        // use MFA yet). So now we're in a situation where we need to use
        // the user's OIDC token to get the information about their
        // CubeSigner account and see if it has an MFA policy set.
        const oidcAuth = await requestOidcAuth(idToken);
        const mfaSessionInfo = oidcAuth.mfaSessionInfo();

        // We set the policy to undefined when MFA is optional.
        setIsSeedlessMfaRequired(typeof mfaSessionInfo !== 'undefined');
      }

      setUserId(identity.identity?.sub);
      setNewsletterEmail(identity.email ?? '');

      if ((identity.user_info?.configured_mfa ?? []).length === 0) {
        history.push(urls.mfaSetup);
      } else {
        history.push(urls.mfaLogin);
      }
    },
    [
      setOidcToken,
      setUserId,
      setIsSeedlessMfaRequired,
      setNewsletterEmail,
      t,
      history,
      featureFlags,
      onError,
      urls,
    ],
  );

  const signIn = useCallback(
    ({
      setIsLoading,
      getOidcToken,
      provider,
    }: GetAuthButtonCallbackOptions) => {
      setIsLoading(true);
      getOidcToken()
        .then(handleOidcToken)
        .catch(() => {
          capture('SeedlessSignInFailed', { provider });
          onError(t('Seedless login error'));
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [capture, handleOidcToken, onError, t],
  );

  const registerTOTPStart = useCallback(() => {
    if (!oidcToken) {
      return false;
    }
    requestOidcAuth(oidcToken)
      .then(async (c) => {
        const mfaSessionInfo = c.requiresMfa() ? c.mfaSessionInfo() : c.data();
        if (!mfaSessionInfo) {
          console.error('No MFA info');
          return;
        }
        const signerSession = await getSignerSession(mfaSessionInfo);
        setMfaSession(signerSession);
        signerSession
          .resetTotpStart(TOTP_ISSUER)
          .then((challenge) => {
            setTotpChallenge(challenge.data());
          })
          .catch((e) => {
            console.error(e);
            onError(
              preferErrorCode
                ? AuthErrorCode.TotpConfigurationError
                : t('Unable to set TOTP configuration'),
            );
          });
        return true;
      })
      .catch((e) => {
        console.error(e);
        capture('SeedlessRegisterTOTPStartFailed');
        return false;
      });
  }, [capture, oidcToken, onError, t, preferErrorCode]);

  const verifyRegistrationCode = useCallback(
    async (code: string) => {
      setErrorMessage('');
      if (!totpChallenge || !mfaSession || code.length < 6 || !oidcToken) {
        return;
      }
      try {
        await mfaSession.resetTotpComplete(totpChallenge.totpId, code);
        // attempt to reuse the code quickly
        const c = await requestOidcAuth(oidcToken);
        if (!c.requiresMfa()) {
          throw new Error('MFA setup failed');
        }

        const status = await mfaSession.totpApprove(c.mfaId(), code);

        if (!status.receipt?.confirmation) {
          if (preferErrorCode) {
            onError(AuthErrorCode.TotpVerificationError);
          } else {
            setErrorMessage(t('Code verification error'));
          }
          return;
        }

        const oidcAuthResponse = await requestOidcAuth(oidcToken, {
          mfaOrgId: getOrgId(),
          mfaId: c.mfaId(),
          mfaConf: status.receipt.confirmation,
        });

        const signerToken = oidcAuthResponse.data();
        setSeedlessSignerToken(signerToken);
        return true;
      } catch (_err) {
        if (preferErrorCode) {
          onError(AuthErrorCode.InvalidTotpCode);
        } else {
          setErrorMessage(t('Invalid code'));
        }
        return false;
      }
    },
    [
      oidcToken,
      setSeedlessSignerToken,
      t,
      totpChallenge,
      mfaSession,
      preferErrorCode,
      onError,
    ],
  );

  const loginWithFIDO = useCallback(async () => {
    if (!oidcToken) {
      return false;
    }
    let resp = await requestOidcAuth(oidcToken);
    if (resp.requiresMfa()) {
      const mfaSessionInfo = resp.mfaSessionInfo();
      if (!mfaSessionInfo) {
        return false;
      }
      const signerSession = await getSignerSession(mfaSessionInfo);
      const respondMfaId = resp.mfaId();

      const challenge = await signerSession.fidoApproveStart(respondMfaId);

      // prompt the user to tap their FIDO and send the answer back to CubeSigner
      const answer = await launchFidoFlow(
        FIDOApiEndpoint.Authenticate,
        challenge.options,
      );
      const mfaInfo = await challenge.answer(answer);

      // print out the current status of the MFA request and assert that it has been approved
      if (!mfaInfo.receipt) {
        throw new Error('MFA not approved yet');
      }

      // proceed with the MFA approval
      resp = await resp.signWithMfaApproval({
        mfaId: respondMfaId,
        mfaOrgId: process.env.SEEDLESS_ORG_ID || '',
        mfaConf: mfaInfo.receipt.confirmation,
      });
    }
    if (resp.requiresMfa()) {
      throw new Error('MFA should not be required after approval');
    }
    setSeedlessSignerToken(await getSignerToken(resp));
    return true;
  }, [oidcToken, setSeedlessSignerToken]);

  const loginWithoutMFA = async () => {
    if (!oidcToken) {
      throw new Error('There is no token to log in');
    }
    const authResponse = await requestOidcAuth(oidcToken);
    const signerToken = await getSignerToken(authResponse);
    setSeedlessSignerToken(signerToken);
  };

  const addFIDODevice = useCallback(
    async (name: string, selectedMethod: RecoveryMethodTypes) => {
      if (!oidcToken) {
        return false;
      }
      const loginResp = await requestOidcAuth(oidcToken);

      const mfaSessionInfo = loginResp.requiresMfa()
        ? loginResp.mfaSessionInfo()
        : loginResp.data();

      if (!mfaSessionInfo) {
        console.error('No MFA info');
        return;
      }

      const session = await getSignerSession(mfaSessionInfo);
      const addFidoResp = await session.addFidoStart(name);
      const challenge = addFidoResp.data();
      if (
        selectedMethod === RecoveryMethodTypes.PASSKEY &&
        (await PublicKeyCredential?.isUserVerifyingPlatformAuthenticatorAvailable())
      ) {
        challenge.options.authenticatorSelection = {
          authenticatorAttachment: 'platform',
        };
      }

      const answer = await launchFidoFlow(
        FIDOApiEndpoint.Register,
        challenge.options,
        recoveryMethodToFidoKeyType(selectedMethod),
      );

      await challenge.answer(answer);

      return true;
    },
    [oidcToken],
  );

  return {
    signIn,
    registerTOTPStart,
    totpChallenge,
    verifyRegistrationCode,
    addFIDODevice,
    loginWithFIDO,
    loginWithoutMFA,
  };
}
