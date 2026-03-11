import type { Quote } from '@avalabs/fusion-sdk';
import { bigintToBig } from '@core/common';
import { bigToBigInt } from '@avalabs/core-utils-sdk';

import { BRIDGE_FEE_SAFETY_MULTIPLIER } from '../../../fusion-config';

/**
 * Extracts the bridge fee in the source chain's native token from a
 * quote's fee list. This fee is added on top of the swap amount in the
 * transaction value for cross-chain native swaps.
 */
const extractBridgeFee = (quote: Quote): bigint => {
  return quote.fees
    .filter(
      (f) =>
        f.type === 'bridge' &&
        f.token.type === 'native' &&
        f.chainId === quote.sourceChain.chainId,
    )
    .reduce((sum, f) => sum + f.amount, 0n);
};

/**
 * Returns the bridge fee for a native token swap with a safety buffer applied,
 * or 0n for non-native swaps (no bridge fee added to tx.value).
 */
export const getNativeBridgeFee = (
  isNative: boolean,
  quote: Quote | null,
): bigint => {
  if (isNative && quote) {
    const { decimals } = quote.sourceChain.networkToken;
    const bridgeFee = extractBridgeFee(quote);
    const bridgeFeeBig = bigintToBig(bridgeFee, decimals);

    return bigToBigInt(
      bridgeFeeBig.mul(BRIDGE_FEE_SAFETY_MULTIPLIER),
      decimals,
    );
  }

  return 0n;
};
