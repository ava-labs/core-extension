import { NetworkContractToken } from '@avalabs/core-chains-sdk';

export type NetworkContractTokenWithVerified = NetworkContractToken & {
  isVerified?: boolean | null;
};

type ApiToken = {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  isNative: boolean;
  logoUri: string | null;
  isVerified?: boolean | null;
  contractType: 'ERC-20' | 'SPL' | null;
  networkCaip2Id: string;
};

export const mapApiTokenToContractToken = (
  token: ApiToken,
): NetworkContractTokenWithVerified | undefined => {
  // Native tokens are surfaced separately by the UI, and contract-token
  // consumers key on address, so skip natives and address-less entries.
  if (token.isNative || !token.address) {
    return undefined;
  }

  const contractType =
    token.contractType ??
    (token.networkCaip2Id.startsWith('solana:') ? 'SPL' : 'ERC-20');

  return {
    address: token.address,
    name: token.name,
    symbol: token.symbol,
    decimals: token.decimals,
    contractType,
    logoUri: token.logoUri ?? undefined,
    isVerified: token.isVerified ?? null,
  };
};
