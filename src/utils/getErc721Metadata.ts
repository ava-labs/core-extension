import { ERC721Metadata } from '@src/background/services/balances/models';
import { ipfsResolverWithFallback } from './ipsfResolverWithFallback';

export async function getErc721Metadata(tokenUri: string) {
  let data: ERC721Metadata = {};
  if (tokenUri.startsWith('data:application/json;base64,')) {
    try {
      const json = Buffer.from(tokenUri.substring(29), 'base64').toString();
      data = JSON.parse(json);
    } catch {
      data = {};
    }
  } else {
    data = await fetch(ipfsResolverWithFallback(tokenUri))
      .then((r) => r.json())
      .catch(() => ({}));
  }
  return data;
}
