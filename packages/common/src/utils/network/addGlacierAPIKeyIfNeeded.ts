import { getCachedCoreApiKey } from '../coreApiKeys';

export function addGlacierAPIKeyIfNeeded(url: string): string {
  if (!process.env.GLACIER_URL || !process.env.PROXY_URL) {
    return url;
  }

  // RPC urls returned in the token list are always using the production URL
  const knownHosts = new Set([
    'glacier-api.avax.network',
    'proxy-api.avax.network',
    new URL(process.env.GLACIER_URL).host,
    new URL(process.env.PROXY_URL).host,
  ]);

  const urlObject = new URL(url);
  const glacierApiKey = getCachedCoreApiKey('glacier');

  if (glacierApiKey && knownHosts.has(urlObject.host)) {
    urlObject.searchParams.append('rltoken', glacierApiKey);
    return urlObject.toString();
  }

  return url;
}
