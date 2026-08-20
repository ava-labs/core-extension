const PRIVATE_HOST_PATTERNS = [
  /^localhost$/i,
  /^127\./, // loopback
  /^10\./, // RFC1918
  /^192\.168\./, // RFC1918
  /^172\.(1[6-9]|2\d|3[01])\./, // RFC1918 172.16.0.0/12
  /^169\.254\./, // link-local (incl. the 169.254.169.254 cloud metadata service)
  /^0\./, // "this" network
  /^\[/, // IPv6 literal (e.g. [::1], [fc00::]) — hostname keeps the brackets
  /\.local$/i, // mDNS
];

/**
 * Whether a URL hostname points at the local machine or a private/reserved
 * network. Shared by every outbound-request guard so the blocklist cannot drift
 * between them.
 */
export const isPrivateHostname = (hostname: string): boolean =>
  PRIVATE_HOST_PATTERNS.some((pattern) => pattern.test(hostname));

/**
 * Whether an untrusted, third-party-controlled URL is safe for the extension to
 * fetch() itself. Every code path that fetches a URL sourced from on-chain or
 * dApp-provided metadata must gate on this.
 */
export const isSafeRemoteUrl = (rawUrl: string): boolean => {
  let parsed: URL;

  try {
    parsed = new URL(rawUrl);
  } catch {
    return false;
  }

  if (parsed.protocol !== 'https:') {
    return false;
  }

  return !isPrivateHostname(parsed.hostname);
};
