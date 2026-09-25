const PRIVATE_HOST_PATTERNS = [
  /(^|\.)localhost$/i, // `localhost` and the `.localhost` TLD (RFC 6761) both resolve to loopback
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
export const isPrivateHostname = (hostname: string): boolean => {
  // Strip a DNS trailing dot (e.g. `localhost.`, `169.254.169.254.`, `router.local.`)
  // so it cannot bypass the exact-host patterns below.
  const normalized = hostname.replace(/\.$/, '');

  return PRIVATE_HOST_PATTERNS.some((pattern) => pattern.test(normalized));
};

/**
 * Whether an untrusted URL is safe to fetch. Private hosts (including
 * localhost) are rejected unless `allowPrivate` is set, which callers pass
 * when the wallet is in testnet mode so local infrastructure still works.
 * Plain HTTP is then limited to those private hosts.
 */
export const isSafeRemoteUrl = (
  rawUrl: string,
  options?: { allowPrivate?: boolean },
): boolean => {
  let parsed: URL;

  try {
    parsed = new URL(rawUrl);
  } catch {
    return false;
  }

  const allowPrivate = options?.allowPrivate ?? false;

  if (parsed.protocol === 'https:') {
    return allowPrivate || !isPrivateHostname(parsed.hostname);
  }

  return (
    allowPrivate &&
    parsed.protocol === 'http:' &&
    isPrivateHostname(parsed.hostname)
  );
};
