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
  skipDefaultSelection = false,
): FungibleTokenBalance | undefined => {
  const defaultTargetTokenIdentifier = sourceToken
    ? DEFAULT_TARGET_TOKENS[sourceToken.symbol]
    : undefined;

  return useMemo(() => {
    const sourceTokenId = sourceToken
      ? getUniqueTokenId(sourceToken)
      : undefined;

    // A non-empty targetTokenId means the user explicitly picked a target.
    // Honor it while it's still a valid target, otherwise deselect — do NOT
    // fall back to a default, so changing the source token to one that
    // invalidates the selection clears it.
    if (targetTokenId) {
      return targetTokens.find((lookupToken) => {
        const lookupTokenId = getUniqueTokenId(lookupToken);
        return (
          lookupTokenId === targetTokenId && lookupTokenId !== sourceTokenId
        );
      });
    }

    // No explicit selection yet. If there is only one target token, select it
    // automatically — unless it's the source token itself (you can't swap a
    // token to itself), in which case there is nothing valid to select.
    const [onlyToken] = targetTokens;
    if (targetTokens.length === 1 && onlyToken) {
      return getUniqueTokenId(onlyToken) === sourceTokenId
        ? undefined
        : onlyToken;
    }

    // No explicit selection — auto-pick a sensible default, unless the user is
    // browsing chains in the open dropdown.
    return skipDefaultSelection
      ? undefined
      : targetTokens.find(
          defaultTokenFinder(
            sourceToken ? !isNativeToken(sourceToken) : false,
            sourceToken?.chainCaipId,
            defaultTargetTokenIdentifier,
          ),
        );
  }, [
    sourceToken,
    targetTokens,
    targetTokenId,
    defaultTargetTokenIdentifier,
    skipDefaultSelection,
  ]);
};

const defaultTokenFinder =
  (
    allowNativeAsDefault: boolean,
    chainId?: string,
    defaultTokenIdentifier?: string,
  ) =>
  (lookupToken: FungibleTokenBalance) => {
    // If we don't have a default token configured for the source token
    // and the source token is not a native token, default to the native token.
    // Example: User chooses "PEPE" as source token -- we select "ETH" as default target token.
    if (isNativeToken(lookupToken)) {
      return (
        !defaultTokenIdentifier &&
        allowNativeAsDefault &&
        lookupToken.chainCaipId === chainId
      );
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
