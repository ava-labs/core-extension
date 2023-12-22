import { SignerSession, TotpChallenge } from '@cubist-labs/cubesigner-sdk';
import {
  SeedlessRegistartionResult,
  approveSeedlessRegistration,
} from '../utils/approveSeedlessRegistration';
import { toast } from '@avalabs/k2-components';
import { useOnboardingContext } from '@src/contexts/OnboardingProvider';
import { useHistory } from 'react-router-dom';
import { OnboardingURLs } from '@src/background/services/onboarding/models';
import {
  requestOidcAuth,
  getOidcClient,
  getOrgId,
  getSignerSession,
} from '@src/utils/seedless/getCubeSigner';
import { useTranslation } from 'react-i18next';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { SeedlessAuthProvider } from '@src/background/services/wallet/models';
import { getSignerToken } from '@src/utils/seedless/getSignerToken';
import { RecoveryMethodTypes } from '../pages/Seedless/models';
import { launchFidoFlow } from '@src/utils/seedless/fido/launchFidoFlow';
import { FIDOApiEndpoint, KeyType } from '@src/utils/seedless/fido/types';

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
    setUserEmail,
    setIsNewAccount,
  } = useOnboardingContext();
  const history = useHistory();
  const { t } = useTranslation();
  const [totpChallenge, setTotpChallenge] = useState<TotpChallenge>();
  const [mfaSession, setMfaSession] = useState<SignerSession | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    errorMessage && toast.error(errorMessage);
  }, [errorMessage]);

  const handleOidcToken = useCallback(
    async (idToken) => {
      setOidcToken(idToken);

      const oidcClient = getOidcClient(idToken);
      const identity = await oidcClient.identityProve();

      if (!identity.user_info) {
        setIsNewAccount(true);
        const result = await approveSeedlessRegistration(identity);

        if (result !== SeedlessRegistartionResult.APPROVED) {
          toast.error(t('Seedless login error'));
          return;
        }
      }
      setUserEmail(identity.email);

      if ((identity.user_info?.configured_mfa ?? []).length === 0) {
        history.push(OnboardingURLs.RECOVERY_METHODS);
      } else {
        history.push(OnboardingURLs.RECOVERY_METHODS_LOGIN);
      }
    },
    [setOidcToken, setUserEmail, setIsNewAccount, t, history]
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
    [capture, handleOidcToken, t]
  );

  const registerTOTPStart = useCallback(() => {
    if (!oidcToken) {
      return false;
    }
    requestOidcAuth(oidcToken)
      .then(async (c) => {
        const mfaSessionInfo = c.mfaSessionInfo();
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
      } catch (e) {
        setErrorMessage(t('Invalid code'));
        return false;
      }
    },
    [oidcToken, setSeedlessSignerToken, t, totpChallenge, mfaSession]
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
        challenge.options
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
        recoveryMethodToFidoKeyType(selectedMethod)
      );

      await challenge.answer(answer);

      return true;
    },
    [oidcToken]
  );

  return {
    signIn,
    registerTOTPStart,
    totpChallenge,
    verifyRegistrationCode,
    addFIDODevice,
    loginWithFIDO,
  };
}
