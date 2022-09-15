import { ipfsResolver } from '@avalabs/utils-sdk';
export function ipfsResolverWithFallback(
  sourceUrl: string,
  desiredGatewayPrefix: string
) {
  try {
    return ipfsResolver(sourceUrl, desiredGatewayPrefix);
  } catch {
    return sourceUrl;
  }
}
