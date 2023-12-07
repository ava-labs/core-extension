import {
  CubeSignerResponse,
  EnvInterface,
  MfaReceipt,
  NewSessionResponse,
  OidcClient,
  SignerSession,
  SignerSessionData,
  SignerSessionManager,
  envs,
} from '@cubist-labs/cubesigner-sdk';

/**
 * Get the CubeSigner deployment environment to use.
 *
 * Defaults to 'gamma' but can be overridden via the 'CUBESIGNER_ENV' environment variable.
 *
 * @return {EnvInterface} CubeSigner deployment environment
 */
export function getEnv(): EnvInterface {
  return envs[process.env.CUBESIGNER_ENV || 'gamma'];
}

/**
 * Get the ID of the CubeSigner organization to use.
 *
 * Must be set via the 'SEEDLESS_ORG_ID' environment variable.
 *
 * @return {string} The ID of the organization in CubeSigner.
 */
export function getOrgId(): string {
  const orgId = process.env.SEEDLESS_ORG_ID;
  if (!orgId) {
    throw new Error('SEEDLESS_ORG_ID must be set');
  }
  return orgId;
}

/**
 * Create a CubeSigner API client for methods that require OIDC authorization.
 *
 * This client can be used to:
 * - obtain a proof of identity (see {@link OidcClient.identityProve})
 * - obtain a full CubeSigner session (see {@link OidcClient.sessionCreate})
 *
 * @param {string} oidcToken The OIDC token to include in 'Authorization' header.
 * @return {OidcClient} CubeSigner API client for methods that require OIDC authorization.
 */
export function getOidcClient(oidcToken: string): OidcClient {
  return new OidcClient(getEnv(), getOrgId(), oidcToken);
}

/**
 * Create a CubeSigner API client for methods that require signer session authorization.
 *
 * @param {NewSessionResponse | SignerSessionData} sessionInfo Signer session information
 *  (e.g., obtained via {@link OidcClient.sessionCreate}) from which to construct the client.
 * @return {SignerSession} CubeSigner API client.
 */
export async function getSignerSession(
  sessionInfo: NewSessionResponse | SignerSessionData
): Promise<SignerSession> {
  return new SignerSession(
    await SignerSessionManager.createFromSessionInfo(
      getEnv(),
      getOrgId(),
      sessionInfo
    )
  );
}

/**
 * Request a new CubeSigner session by logging in via OIDC.
 *
 * The new session can be passed to {@link getSignerSession} to create a CubeSigner API client.
 *
 * @param {string} oidcToken The OIDC token to include in 'Authorization' header.
 * @param {MfaReceipt | undefined} mfaReceipt Optional MFA receipt to attach to this request.
 * @return {CubeSignerResponse<SignerSessionData>} The response. If MFA for this request is
 *   required, {@link CubeSignerResponse.requiresMfa()} is set to true and
 *   {@link CubeSignerResponse.mfaSessionInfo()} contains a temporary session that allows
 *   access to the CubeSigner MFA endpoints; otherwise, {@link CubeSignerResponse.data()}
 *   contains the new session information.
 */
export async function requestOidcAuth(
  oidcToken: string,
  mfaReceipt?: MfaReceipt | undefined
): Promise<CubeSignerResponse<SignerSessionData>> {
  const oidcClient = getOidcClient(oidcToken);
  return await oidcClient.sessionCreate(
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
}
