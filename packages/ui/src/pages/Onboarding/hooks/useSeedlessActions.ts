import { useAnalyticsContext } from '@/contexts/AnalyticsProvider';
import { useFeatureFlagContext } from '@/contexts/FeatureFlagsProvider';
import { useOnboardingContext } from '@/contexts/OnboardingProvider';
import { toast } from '@avalabs/core-k2-components';
import {
  FIDOApiEndpoint,
  FeatureGates,
  KeyType,
  OnboardingURLs,
  SeedlessAuthProvider,
} from '@core/types';
import {
  getOidcClient,
  getOrgId,
  getSignerSession,
  getSignerToken,
  launchFidoFlow,
  requestOidcAuth,
} from '@core/utils';
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
import { RecoveryMethodTypes } from '../pages/Seedless/models';
import {
  SeedlessRegistartionResult,
  approveSeedlessRegistration,
} from '../utils/approveSeedlessRegistration';

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

export function useSeedlessActions() {
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
    if (!errorMessage) {
      return;
    }
    toast.error(errorMessage);
  }, [errorMessage]);

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
          toast.error(t('Seedless login error'));
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
        history.push(OnboardingURLs.RECOVERY_METHODS);
      } else {
        history.push(OnboardingURLs.RECOVERY_METHODS_LOGIN);
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
          toast.error(t('Seedless login error'));
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [capture, handleOidcToken, t],
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
            toast(t('Unable to set TOTP configuration'));
          });
        return true;
      })
      .catch((e) => {
        console.error(e);
        capture('SeedlessRegisterTOTPStartFailed');
        return false;
      });
  }, [capture, oidcToken, t]);

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
          setErrorMessage(t('Code verification error'));
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
        setErrorMessage(t('Invalid code'));
        return false;
      }
    },
    [oidcToken, setSeedlessSignerToken, t, totpChallenge, mfaSession],
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
