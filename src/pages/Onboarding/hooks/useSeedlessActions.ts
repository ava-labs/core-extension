import {
  CubeSigner,
  envs,
  SignerSession,
  SignerSessionManager,
  TotpChallenge,
} from '@cubist-labs/cubesigner-sdk';
import {
  SeedlessRegistartionResult,
  approveSeedlessRegistration,
} from '../utils/approveSeedlessRegistration';
import { toast } from '@avalabs/k2-components';
import { useOnboardingContext } from '@src/contexts/OnboardingProvider';
import { useHistory } from 'react-router-dom';
import { OnboardingURLs } from '@src/background/services/onboarding/models';
import { getCubeSigner } from '../utils/getCubeSigner';
import { useTranslation } from 'react-i18next';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { RecoveryMethodTypes } from '../pages/Seedless/models';

type OidcTokenGetter = () => Promise<string>;
type GetAuthButtonCallbackOptions = {
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  getOidcToken: OidcTokenGetter;
};

export function useSeedlessActions() {
  const { setOidcToken, setSeedlessSignerToken, oidcToken } =
    useOnboardingContext();
  const history = useHistory();
  const { t } = useTranslation();
  const [totpChallenge, setTotpChallenge] = useState<TotpChallenge>();
  const [cubeSigner, setCubeSigner] = useState<CubeSigner | null>(null);
  const [mfaManager, setMfaManager] = useState<SignerSessionManager | null>(
    null
  );
  const [errorMessage, setErrorMessage] = useState('');
  const [mfaId, setMfaId] = useState<string | null>(null);

  useEffect(() => {
    errorMessage && toast.error(errorMessage);
  }, [errorMessage]);

  const handleOidcToken = useCallback(
    async (idToken) => {
      setOidcToken(idToken);

      const cubesigner = new CubeSigner({
        orgId: process.env.SEEDLESS_ORG_ID || '',
        env: envs[process.env.CUBESIGNER_ENV || ''],
      });

      const identity = await cubesigner.oidcProveIdentity(
        idToken,
        process.env.SEEDLESS_ORG_ID || ''
      );

      if (!identity.user_info) {
        const result = await approveSeedlessRegistration(identity);

        if (result !== SeedlessRegistartionResult.APPROVED) {
          toast.error(t('Seedless login error'));
          return;
        }
      }
      try {
        const oidcAuthResponse = await getCubeSigner(idToken);
        const sessionInfo = oidcAuthResponse.data();
        const sessionMgr = await SignerSessionManager.createFromSessionInfo(
          envs[process.env.CUBESIGNER_ENV || ''],
          process.env.SEEDLESS_ORG_ID || '',
          sessionInfo
        );
        const signerToken = await sessionMgr.storage.retrieve();

        setSeedlessSignerToken(signerToken);
        if ((identity.user_info?.configured_mfa ?? []).length === 0) {
          history.push(OnboardingURLs.RECOVERY_METHODS);
        } else {
          history.push(OnboardingURLs.RECOVERY_METHODS_LOGIN);
        }
      } catch (e) {
        toast.error(t('Invalid code'));
      }
    },
    [history, setSeedlessSignerToken, setOidcToken, t]
  );

  const signIn = useCallback(
    ({ setIsLoading, getOidcToken }: GetAuthButtonCallbackOptions) => {
      setIsLoading(true);
      getOidcToken()
        .then(handleOidcToken)
        .catch(() => {
          toast.error(t('Seedless login error'));
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [handleOidcToken, t]
  );

  const registerTOTPStart = useCallback(() => {
    if (!oidcToken) {
      return false;
    }
    getCubeSigner(oidcToken)
      .then(async (c) => {
        const mfaSessionInfo = c.mfaSessionInfo();
        if (!mfaSessionInfo) {
          console.error('No MFA info');
          return;
        }
        const manager = await SignerSessionManager.createFromSessionInfo(
          envs[process.env.CUBESIGNER_ENV || ''],
          process.env.SEEDLESS_ORG_ID || '',
          mfaSessionInfo
        );
        setMfaManager(manager);
        const cs = new CubeSigner({
          sessionMgr: manager,
        });
        setCubeSigner(cs);

        cs.resetTotpStart()
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
        return false;
      });
  }, [oidcToken, t]);

  const verifyRegistrationCode = useCallback(
    async (code: string) => {
      setErrorMessage('');
      if (
        !cubeSigner ||
        !totpChallenge ||
        !mfaManager ||
        code.length < 6 ||
        !oidcToken
      ) {
        return;
      }
      try {
        await cubeSigner.resetTotpComplete(totpChallenge.totpId, code);
        // attempt to reuse the code quickly
        const c = await getCubeSigner(oidcToken);
        const mfaSessionInfo = c.mfaSessionInfo();
        if (!mfaSessionInfo) {
          return;
        }

        if (!c.requiresMfa()) {
          throw new Error('MFA setup failed');
        }

        const mfaSession = new SignerSession(
          await SignerSessionManager.createFromSessionInfo(
            envs[process.env.CUBESIGNER_ENV || ''],
            process.env.SEEDLESS_ORG_ID || '',
            mfaSessionInfo
          )
        );
        const status = await mfaSession.totpApprove(c.mfaId(), code);

        if (!status.receipt?.confirmation) {
          setErrorMessage(t('Code verification error'));
          return;
        }

        const oidcAuthResponse = await getCubeSigner(oidcToken, {
          mfaOrgId: process.env.SEEDLESS_ORG_ID || '',
          mfaId: c.mfaId(),
          mfaConf: status.receipt.confirmation,
        });

        const sessionInfo = oidcAuthResponse.data();
        const sessionMgr = await SignerSessionManager.createFromSessionInfo(
          envs[process.env.CUBESIGNER_ENV || ''],
          process.env.SEEDLESS_ORG_ID || '',
          sessionInfo
        );
        setSeedlessSignerToken(await sessionMgr.storage.retrieve());
        return true;
      } catch (e) {
        setErrorMessage(t('Invalid code'));
        return false;
      }
    },
    [
      cubeSigner,
      mfaManager,
      oidcToken,
      setSeedlessSignerToken,
      t,
      totpChallenge,
    ]
  );

  const loginTOTPStart = useCallback(() => {
    if (!oidcToken) {
      return false;
    }
    getCubeSigner(oidcToken).then(async (c) => {
      if (!c.requiresMfa()) {
        const signerSession = await SignerSessionManager.createFromSessionInfo(
          envs[process.env.CUBESIGNER_ENV || ''],
          process.env.SEEDLESS_ORG_ID || '',
          c.data()
        );
        setSeedlessSignerToken(await signerSession.storage.retrieve());
        history.push(OnboardingURLs.CREATE_PASSWORD);
        return true;
      }
      const mfaSession = c.mfaSessionInfo();
      if (!mfaSession) {
        return false;
      }

      setMfaId(c.mfaId());
      setMfaManager(
        await SignerSessionManager.createFromSessionInfo(
          envs[process.env.CUBESIGNER_ENV || ''],
          process.env.SEEDLESS_ORG_ID || '',
          mfaSession
        )
      );
      return true;
    });
  }, [history, oidcToken, setSeedlessSignerToken]);

  const verifyLoginCode = useCallback(
    async (code: string) => {
      setErrorMessage('');
      if (!mfaManager || !mfaId || !oidcToken || code.length < 6) {
        return;
      }

      try {
        const mfaSession = new SignerSession(mfaManager);
        const status = await mfaSession.totpApprove(mfaId, code);

        if (!status.receipt?.confirmation) {
          setErrorMessage(t('Code verification error'));
          return;
        }

        const oidcAuthResponse = await getCubeSigner(oidcToken, {
          mfaOrgId: process.env.SEEDLESS_ORG_ID || '',
          mfaId,
          mfaConf: status.receipt.confirmation,
        });
        const sessionInfo = oidcAuthResponse.data();
        const sessionMgr = await SignerSessionManager.createFromSessionInfo(
          envs[process.env.CUBESIGNER_ENV || ''],
          process.env.SEEDLESS_ORG_ID || '',
          sessionInfo
        );
        setSeedlessSignerToken(await sessionMgr.storage.retrieve());
        return true;
      } catch (e) {
        setErrorMessage(t('Invalid code'));
        return false;
      }
    },
    [mfaManager, mfaId, oidcToken, setSeedlessSignerToken, t]
  );

  const loginWithFIDO = useCallback(async () => {
    if (!oidcToken) {
      return false;
    }
    const cs = new CubeSigner({
      orgId: process.env.SEEDLESS_ORG_ID || '',
      env: envs[process.env.CUBESIGNER_ENV || ''],
    });
    let resp = await cs.oidcLogin(
      oidcToken,
      process.env.SEEDLESS_ORG_ID || '',
      ['sign:*']
    );
    if (resp.requiresMfa()) {
      const mfaSession = resp.mfaSessionInfo();
      if (!mfaSession) {
        return false;
      }
      const mfaSessionMgr = await SignerSessionManager.createFromSessionInfo(
        envs[process.env.CUBESIGNER_ENV || ''],
        process.env.SEEDLESS_ORG_ID || '',
        mfaSession
      );

      const signerSession = new SignerSession(mfaSessionMgr);
      const respondMfaId = resp.mfaId();

      const challenge = await signerSession.fidoApproveStart(respondMfaId);

      // Extensions need to leave rpId blank
      // https://chromium.googlesource.com/chromium/src/+/main/content/browser/webauth/origins.md
      delete challenge.options.rpId;

      // prompt the user to tap their FIDO and send the answer back to CubeSigner
      const mfaInfo = await challenge.createCredentialAndAnswer();

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
    const sessionInfo = resp.data();
    const signerSessionManager =
      await SignerSessionManager.createFromSessionInfo(
        envs[process.env.CUBESIGNER_ENV || ''],
        process.env.SEEDLESS_ORG_ID || '',
        sessionInfo
      );

    setSeedlessSignerToken(await signerSessionManager.storage.retrieve());
    return true;
  }, [oidcToken, setSeedlessSignerToken]);

  const addFIDODevice = useCallback(
    async (name: string, selectedMethod: RecoveryMethodTypes) => {
      if (!oidcToken) {
        return false;
      }
      let cs = new CubeSigner({
        orgId: process.env.SEEDLESS_ORG_ID || '',
        env: envs[process.env.CUBESIGNER_ENV || ''],
      });
      const loginResp = await cs.oidcLogin(
        oidcToken,
        process.env.SEEDLESS_ORG_ID || '',
        ['manage:mfa']
      );

      const mfaSessionInfo = loginResp.requiresMfa()
        ? loginResp.mfaSessionInfo()
        : loginResp.data();

      if (!mfaSessionInfo) {
        console.error('No MFA info');
        return;
      }

      const sessionMgr = await SignerSessionManager.createFromSessionInfo(
        envs[process.env.CUBESIGNER_ENV || ''],
        process.env.SEEDLESS_ORG_ID || '',
        mfaSessionInfo
      );
      cs = new CubeSigner({
        orgId: process.env.SEEDLESS_ORG_ID || '',
        env: envs[process.env.CUBESIGNER_ENV || ''],
        sessionMgr,
      });
      const addFidoResp = await cs.addFidoStart(name);
      const challenge = addFidoResp.data();
      if (
        selectedMethod === RecoveryMethodTypes.PASSKEY &&
        (await PublicKeyCredential?.isUserVerifyingPlatformAuthenticatorAvailable())
      ) {
        challenge.options.authenticatorSelection = {
          authenticatorAttachment: 'platform',
        };
      }

      // Extensions need to leave rpId blank
      // https://chromium.googlesource.com/chromium/src/+/main/content/browser/webauth/origins.md
      delete challenge.options.rp.id;

      await challenge.createCredentialAndAnswer();

      return true;
    },
    [oidcToken]
  );

  return {
    signIn,
    registerTOTPStart,
    totpChallenge,
    verifyRegistrationCode,
    verifyLoginCode,
    loginTOTPStart,
    addFIDODevice,
    loginWithFIDO,
  };
}
