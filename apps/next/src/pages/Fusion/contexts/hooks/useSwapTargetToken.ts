import { useMemo } from 'react';

import {
  FungibleTokenBalance,
  getUniqueTokenId,
  isErc20Token,
  isNativeToken,
} from '@core/types';

import { DEFAULT_TARGET_TOKENS } from '../../fusion-config';

export const useSwapTargetToken = (
  targetTokens: FungibleTokenBalance[],
  sourceToken?: FungibleTokenBalance,
  targetTokenId?: string,
): FungibleTokenBalance | undefined => {
  const defaultTargetTokenIdentifier = sourceToken
    ? DEFAULT_TARGET_TOKENS[sourceToken.symbol]
    : undefined;

  return useMemo(() => {
    const sourceTokenId = sourceToken
      ? getUniqueTokenId(sourceToken)
      : undefined;

    const foundById = targetTokens.find((lookupToken) => {
      const lookupTokenId = getUniqueTokenId(lookupToken);
      return lookupTokenId === targetTokenId && lookupTokenId !== sourceTokenId;
    });

    return (
      foundById ??
      targetTokens.find(
        defaultTokenFinder(
          sourceToken ? !isNativeToken(sourceToken) : false,
          defaultTargetTokenIdentifier,
        ),
      )
    );
  }, [sourceToken, targetTokens, targetTokenId, defaultTargetTokenIdentifier]);
};

const defaultTokenFinder =
  (allowNativeAsDefault: boolean, defaultTokenIdentifier?: string) =>
  (lookupToken: FungibleTokenBalance) => {
    // If we don't have a default token configured for the source token
    // and the source token is not a native token, default to the native token.
    // Example: User chooses "PEPE" as source token -- we select "ETH" as default target token.
    if (isNativeToken(lookupToken)) {
      return !defaultTokenIdentifier && allowNativeAsDefault;
    }

    if (!defaultTokenIdentifier) {
      return false;
    }

    if (isErc20Token(lookupToken)) {
      return (
        lookupToken.address.toLowerCase() ===
        defaultTokenIdentifier.toLowerCase()
      );
    }

    return lookupToken.address === defaultTokenIdentifier;
  };
