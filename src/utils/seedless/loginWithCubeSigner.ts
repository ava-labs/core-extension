import { CubeSigner, MfaReceipt, envs } from '@cubist-labs/cubesigner-sdk';

export async function loginWithCubeSigner(
  oidcToken: string,
  mfaReceipt?: MfaReceipt | undefined
) {
  const cubesigner = new CubeSigner({
    env: envs[process.env.CUBESIGNER_ENV || ''],
  });
  const authResponse = await cubesigner.oidcLogin(
    oidcToken,
    process.env.SEEDLESS_ORG_ID || '',
    ['sign:*', 'manage:*'],
    {
      // How long singing with a particular token works from the token creation
      auth_lifetime: 5 * 60, // 5 minutes
      // How long a refresh token is valid, the user has to unlock Core in this timeframe otherwise they will have to re-login
      // Sessions expire either if the session lifetime expires or if a refresh token expires before a new one is generated
      refresh_lifetime: 90 * 24 * 60 * 60, // 90 days
      // How long till the user absolutely must sign in again
      session_lifetime: 1 * 365 * 24 * 60 * 60, // 1 year
    },
    mfaReceipt
  );

  return authResponse;
}
