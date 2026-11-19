import { AlertType } from '@avalabs/vm-module-types';

import type { SiweMessage } from './parseSiweMessage';

// Same shape as the vm-module-types Alert, widened with the `body` field
// that MaliciousTxOverlay renders for itemized warnings.
export type SiweAlert = {
  type: AlertType;
  details: {
    title: string;
    description: string;
    body?: string[];
  };
};

/**
 * Compares the SIWE message's domain and URI against the requesting dApp's
 * origin URL. Returns a DANGER alert if there is a mismatch in domain,
 * scheme, or port — which may indicate a phishing attempt.
 */
export function validateSiweOrigin(
  siwe: SiweMessage,
  dappUrl: string,
): SiweAlert | undefined {
  const dappOrigin = safeParseUrl(dappUrl);
  const siweUri = safeParseUrl(siwe.uri);

  if (!dappOrigin) return undefined;

  const parsedDomain = safeParseUrl(siwe.domain);
  const domainHasScheme = siwe.domain.includes('://');

  const domainMismatch = parsedDomain
    ? domainFieldMismatch(parsedDomain, domainHasScheme, dappOrigin)
    : normalizeDomain(siwe.domain) !==
      normalizeDomain(dappOrigin.hostname ?? '');

  const uriMismatch =
    siweUri !== undefined &&
    (normalizeScheme(siweUri.protocol) !==
      normalizeScheme(dappOrigin.protocol) ||
      effectivePort(siweUri) !== effectivePort(dappOrigin) ||
      normalizeDomain(siweUri.hostname ?? '') !==
        normalizeDomain(dappOrigin.hostname ?? ''));

  if (!domainMismatch && !uriMismatch) return undefined;

  // EIP-4361 domain is an authority, so show host plus any non-default port.
  const dappAuthority = dappOrigin.host || dappUrl;
  const dappDisplay = formatOrigin(dappOrigin, dappUrl);
  const reasons: string[] = [];
  if (domainMismatch)
    reasons.push(
      `Domain "${siwe.domain}" doesn't match dApp origin "${dappAuthority}".`,
    );
  if (uriMismatch)
    reasons.push(
      `URI "${siwe.uri}" doesn't match dApp origin "${dappDisplay}".`,
    );

  // MaliciousTxOverlay renders body[0] as the description and body[1] as an
  // underlined call-to-action, so keep all reasons in a single first line.
  return {
    type: AlertType.DANGER,
    details: {
      title: 'Sign-In Request Mismatch',
      description: 'This could be a phishing attempt. Proceed with caution.',
      body: [
        reasons.join(' '),
        'This could be a phishing attempt. Proceed with caution.',
      ],
    },
  };
}

function safeParseUrl(url: string): URL | undefined {
  try {
    // Handle bare domains (no scheme) by prepending https://
    if (!url.includes('://')) {
      return new URL(`https://${url}`);
    }
    return new URL(url);
  } catch {
    return undefined;
  }
}

function normalizeDomain(domain: string): string {
  return domain.toLowerCase().replace(/\.$/, '');
}

function normalizeScheme(protocol: string): string {
  return protocol.replace(/:$/, '').toLowerCase();
}

const DEFAULT_PORTS: Record<string, string> = {
  'http:': '80',
  'https:': '443',
};

function effectivePort(url: URL): string {
  return url.port || DEFAULT_PORTS[url.protocol] || '';
}

/**
 * EIP-4361 defines `domain` as an RFC 3986 authority (host plus optional
 * port), so it has to match the requesting origin's host *and* port exactly:
 * a subdomain, parent domain or different port is a different authority.
 * A domain without a port implies the default port of the dApp's scheme
 * (or of its own scheme, if a non-standard scheme prefix was included).
 */
function domainFieldMismatch(
  parsedDomain: URL,
  hasScheme: boolean,
  dappOrigin: URL,
): boolean {
  // Userinfo ("victim.com@attacker.com") is not a meaningful SIWE domain and
  // only serves to make the displayed domain misleading.
  if (parsedDomain.username || parsedDomain.password) {
    return true;
  }

  if (
    normalizeDomain(parsedDomain.hostname) !==
    normalizeDomain(dappOrigin.hostname ?? '')
  ) {
    return true;
  }

  if (
    hasScheme &&
    normalizeScheme(parsedDomain.protocol) !==
      normalizeScheme(dappOrigin.protocol)
  ) {
    return true;
  }

  const domainPort =
    parsedDomain.port ||
    DEFAULT_PORTS[hasScheme ? parsedDomain.protocol : dappOrigin.protocol] ||
    '';

  return domainPort !== effectivePort(dappOrigin);
}

function formatOrigin(url: URL, fallback: string): string {
  const hostname = url.hostname || fallback;
  const scheme = normalizeScheme(url.protocol);
  const isStandardScheme = scheme === 'https';
  const hasNonStandardPort = url.port !== '';

  let result = hostname;
  if (!isStandardScheme) {
    result = `${scheme}://${result}`;
  }
  if (hasNonStandardPort) {
    result = `${result}:${url.port}`;
  }
  return result;
}
