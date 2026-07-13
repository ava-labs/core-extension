import { isValidAddress } from '@core/common';
import type { SpotMetaResponse } from './schemas';

export type HypercoreSpotToken = {
  index: number;
  name: string;
  symbol: string;
  decimals: number;
  /** Present only when the spot token is bridged to HyperEVM. */
  address?: string;
};

/**
 * Maps `spotMeta` tokens to the registry used when resolving spot balances.
 * Keeps every spot token (including HyperCore-only ones without an EVM contract).
 */
export const toHypercoreSpotTokens = (tokens: SpotMetaResponse['tokens']) =>
  tokens.map((token): HypercoreSpotToken => {
    const address = token.evmContract?.address.toLowerCase();

    return {
      index: token.index,
      name: token.fullName ?? token.name,
      symbol: token.name,
      decimals: token.weiDecimals,
      address: address && isValidAddress(address) ? address : undefined,
    };
  });
