import type { TxToken } from '@avalabs/vm-module-types';

function addressesMatch(a: string | undefined, b: string | undefined): boolean {
  if (!a || !b) {
    return false;
  }
  if (a.startsWith('0x') && b.startsWith('0x')) {
    return a.toLowerCase() === b.toLowerCase();
  }
  return a === b;
}

export type SwapDisplayLegs = {
  source: TxToken | undefined;
  target: TxToken | undefined;
};

/**
 * Match core-mobile `TokenActivityListItemTitle.getSwapTitle`: prefer legs where the user is
 * `from` (source) and `to` (target); otherwise fall back to `tokens[0]` / `tokens[1]`.
 * Either leg may be undefined; the UI should show a translated placeholder for missing symbols.
 * When `tokens` is empty, both are `undefined`.
 */
export function resolveSwapDisplayTokens(
  tokens: TxToken[],
  userAddress: string,
): SwapDisplayLegs {
  if (tokens.length === 0) {
    return { source: undefined, target: undefined };
  }

  if (!userAddress) {
    return {
      source: tokens[0],
      target: tokens[1],
    };
  }

  const sourceTokens = tokens.filter((token) =>
    addressesMatch(token.from?.address, userAddress),
  );
  const targetTokens = tokens.filter((token) =>
    addressesMatch(token.to?.address, userAddress),
  );

  if (sourceTokens.length > 0 && targetTokens.length > 0) {
    const source = sourceTokens[0];
    const target = targetTokens[0];
    if (source && target) {
      return { source, target };
    }
  }

  if (sourceTokens.length > 0 && targetTokens.length === 0) {
    const source = sourceTokens[0];
    if (source) {
      return { source, target: undefined };
    }
  }

  if (sourceTokens.length === 0 && targetTokens.length > 0) {
    const target = targetTokens[0];
    if (target) {
      return { source: undefined, target };
    }
  }

  return {
    source: tokens[0],
    target: tokens[1],
  };
}
