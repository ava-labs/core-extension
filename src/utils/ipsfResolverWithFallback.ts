import { ipfsResolver } from '@avalabs/utils-sdk';
import { CLOUDFLARE_IPFS_URL } from '@src/background/services/balances/models';
export function ipfsResolverWithFallback(
  sourceUrl: string | undefined,
  desiredGatewayPrefix: string = CLOUDFLARE_IPFS_URL
) {
  if (!sourceUrl) {
    return '';
  }

  try {
    return ipfsResolver(sourceUrl, desiredGatewayPrefix);
  } catch {
    return sourceUrl;
  }
}
