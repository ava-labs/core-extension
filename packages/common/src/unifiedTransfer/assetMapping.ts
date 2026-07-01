import { TokenType } from '@avalabs/fusion-sdk';
import type { AssetWithExtras } from '@avalabs/fusion-sdk';
import type { Address } from '@solana/kit';

type EvmAddress = `0x${string}`;

export interface ApiToken {
  name: string;
  symbol: string;
  decimals: number | null;
  logoUri: string | null;
  isNative: boolean;
  address: string;
  contractType: 'ERC-20' | 'SPL' | null;
  networkCaip2Id: string;
}

const isSolanaToken = (token: ApiToken) =>
  token.contractType === 'SPL' || token.networkCaip2Id.startsWith('solana:');

const resolveDecimals = (token: ApiToken): number =>
  token.decimals ?? (isSolanaToken(token) ? 9 : 18);

export const mapApiTokenToAsset = (
  token: ApiToken,
): AssetWithExtras | undefined => {
  const base = {
    name: token.name,
    symbol: token.symbol,
    decimals: resolveDecimals(token),
    logoUri: token.logoUri ?? undefined,
  };

  if (token.isNative) {
    return { ...base, type: TokenType.NATIVE };
  }

  if (!token.address) {
    return undefined;
  }

  if (isSolanaToken(token)) {
    return { ...base, type: TokenType.SPL, address: token.address as Address };
  }

  return {
    ...base,
    type: TokenType.ERC20,
    address: token.address as EvmAddress,
  };
};
