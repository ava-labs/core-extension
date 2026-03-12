import type { Quote } from '@avalabs/fusion-sdk';
import { bigintToBig } from '@core/common';
import { bigToBigInt } from '@avalabs/core-utils-sdk';
import { getBufferMultiplierFromBps } from '@/pages/Fusion/lib/getBufferMultiplierFromBps';

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
  quote: Quote,
  bridgeFeeSafetyBps: string,
): bigint => {
  const { decimals } = quote.sourceChain.networkToken;
  const bridgeFee = extractBridgeFee(quote);
  const bridgeFeeBig = bigintToBig(bridgeFee, decimals);

  return bigToBigInt(
    bridgeFeeBig.mul(getBufferMultiplierFromBps(bridgeFeeSafetyBps)),
    decimals,
  );
};
