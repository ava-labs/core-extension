import { isDevelopment, isPrivateHostname } from '@core/common';

/**
 * HTTPS only (plus HTTP in development for local nodes), and never a
 * private/reserved host in production — otherwise a dApp could point the wallet
 * at an internal service (SSRF).
 */
export const isAllowedRpcUrl = (url: string): boolean => {
  try {
    const { protocol, hostname } = new URL(url);

    if (protocol !== 'https:' && !(isDevelopment() && protocol === 'http:')) {
      return false;
    }

    if (!isDevelopment() && isPrivateHostname(hostname)) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
};
