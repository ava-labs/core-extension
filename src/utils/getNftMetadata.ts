import { NftMetadata } from 'packages/service-worker/src/services/balances/models';
import { ipfsResolverWithFallback } from './ipsfResolverWithFallback';

async function fetchWithTimeout(uri: string, timeout = 5000) {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), timeout);

  return fetch(uri, { signal: controller.signal });
}

export async function getNftMetadata(tokenUri: string) {
  let data: NftMetadata = {};
  if (!tokenUri) {
    return {};
  } else if (tokenUri.startsWith('data:application/json;base64,')) {
    const value = tokenUri.substring(29);
    try {
      const json = Buffer.from(value, 'base64').toString();
      data = JSON.parse(json);
    } catch {
      data = {};
    }
  } else {
    data = await fetchWithTimeout(ipfsResolverWithFallback(tokenUri))
      .then((r) => r.json())
      .catch(() => ({}));
  }
  return data;
}
