import {
  NftTokenWithBalance,
  TokenWithBalance,
} from '@avalabs/vm-module-types';
import { isNFT } from '../nft/utils/isNFT';

export function groupTokensByType(
  balances?: Record<string, Record<string, TokenWithBalance>>
): {
  nfts: Record<string, Record<string, NftTokenWithBalance>>;
  tokens: Record<string, Record<string, TokenWithBalance>>;
} {
  const nfts: Record<string, Record<string, NftTokenWithBalance>> = {};
  const tokens: Record<string, Record<string, TokenWithBalance>> = {};
  if (!balances) {
    return { tokens, nfts };
  }
  for (const address in balances) {
    nfts[address] = {};
    tokens[address] = {};
    const nftsForAddress = nfts[address];
    const tokensForAddress = tokens[address];
    for (const tokenId in balances[address]) {
      const token = balances[address]?.[tokenId];
      if (!token || !tokensForAddress || !nftsForAddress) {
        continue;
      }
      if (isNFT(token)) {
        nftsForAddress[tokenId] = token;
      } else {
        tokensForAddress[tokenId] = token;
      }
    }
  }

  return {
    nfts,
    tokens,
  };
}
