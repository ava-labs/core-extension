import type {
  CubeSigner,
  SignerSessionData,
} from '@cubist-labs/cubesigner-sdk';
import { SignerSessionManager, envs } from '@cubist-labs/cubesigner-sdk';

export const getSignerToken = async (
  oidcAuthResponse: Awaited<ReturnType<CubeSigner['oidcLogin']>>,
): Promise<SignerSessionData> => {
  const sessionInfo = oidcAuthResponse.data();
  const sessionMgr = await SignerSessionManager.createFromSessionInfo(
    envs[process.env.CUBESIGNER_ENV || ''],
    process.env.SEEDLESS_ORG_ID || '',
    sessionInfo,
  );

  return sessionMgr.storage.retrieve();
};
