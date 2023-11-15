import { authenticateWithGoogle } from '../utils/authenticateWithGoogle';
import {
  CubeSigner,
  envs,
  SignerSessionManager,
} from '@cubist-dev/cubesigner-sdk';
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
import { Dispatch, SetStateAction, useCallback } from 'react';

export function useSeedlessButtonActions() {
  const { setOidcToken, setSeedlessSignerToken } = useOnboardingContext();
  const history = useHistory();
  const { t } = useTranslation();

  const googleButtonAction = useCallback(
    (setIsLoading: Dispatch<SetStateAction<boolean>>) => {
      setIsLoading(true);
      authenticateWithGoogle()
        .then(async (idToken) => {
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
            const result = await approveSeedlessRegistration(idToken);

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
            history.push(OnboardingURLs.CREATE_PASSWORD);
          } catch (e) {
            toast.error(t('Invalid code'));
          }
        })
        .catch(() => {
          toast.error(t('Seedless login error'));
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [history, setOidcToken, setSeedlessSignerToken, t]
  );
  return {
    googleButtonAction,
  };
}
