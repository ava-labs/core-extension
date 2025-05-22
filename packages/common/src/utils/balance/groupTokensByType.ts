import {
  NftTokenWithBalance,
  TokenWithBalance,
} from '@avalabs/vm-module-types';
import { isNFT } from '../nfts/isNFT';

export function groupTokensByType(
  balances?: Record<string, Record<string, TokenWithBalance>>,
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
    const nftsForAddress = {};
    const tokensForAddress = {};
    for (const tokenId in balances[address]) {
      const token = balances[address]?.[tokenId];
      if (!token) {
        continue;
      }
      if (isNFT(token)) {
        nftsForAddress[tokenId] = token;
      } else {
        tokensForAddress[tokenId] = token;
      }
    }

    nfts[address] = nftsForAddress;
    tokens[address] = tokensForAddress;
  }

  return {
    nfts,
    tokens,
  };
}
