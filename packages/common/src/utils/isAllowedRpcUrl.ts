import { isPrivateHostname } from './isSafeRemoteUrl';

/**
 * HTTPS to a public host, unless `allowPrivate` is set (the wallet is in
 * testnet mode). Testnet mode may use HTTP and private hosts so builders can
 * point Core at a local node. On mainnet a dApp must not be able to aim the
 * wallet at an internal service (SSRF).
 */
export const isAllowedRpcUrl = (
  url: string,
  options?: { allowPrivate?: boolean },
): boolean => {
  try {
    const { protocol, hostname } = new URL(url);
    const allowPrivate = options?.allowPrivate ?? false;

    if (protocol === 'https:') {
      return allowPrivate || !isPrivateHostname(hostname);
    }

    return allowPrivate && protocol === 'http:';
  } catch {
    return false;
  }
};
