import { NetworkContractToken } from '@avalabs/core-chains-sdk';
import type {
  NetworkTokensByCaip2Response,
  TokenInfo,
} from '~/api-clients/token-aggregator';

export type NetworkContractTokenWithVerified = NetworkContractToken & {
  isVerified?: boolean | null;
};

type ApiToken = NetworkTokensByCaip2Response['tokens'][number];

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

export const mapTokenInfoToContractToken = (
  info: TokenInfo,
  caip2Id: string,
  address: string,
): NetworkContractTokenWithVerified | undefined => {
  const decimals = info.meta?.decimals?.[caip2Id];

  if (info.isNative || decimals === null || decimals === undefined) {
    return undefined;
  }

  return {
    address,
    name: info.name,
    symbol: info.symbol,
    decimals,
    contractType: caip2Id.startsWith('solana:') ? 'SPL' : 'ERC-20',
    logoUri: info.meta?.logoUri ?? undefined,
    isVerified: null,
  };
};
