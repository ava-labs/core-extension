import { TokenType } from '@avalabs/vm-module-types';

import {
  FungibleTokenBalance,
  getUniqueTokenId,
  isErc20Token,
  isNativeToken,
} from '@core/types';

import { SwappableToken } from '../types';
import { DEFAULT_SOURCE_TOKENS, DEFAULT_TARGET_TOKENS } from '../swap-config';
import { useTargetSwapTokens } from './useTargetSwapTokens';
import { useSwappableTokensForAccount } from './useSwappableTokensForAccount';
import { useAccountsContext } from '@core/ui';

/**
 * Extracts the chainId from a unique token ID.
 * Format: TYPE:identifier:chainId
 */
const getChainIdFromTokenId = (tokenId?: string): number | undefined => {
  if (!tokenId) return undefined;
  const parts = tokenId.split(':');
  const chainId = parts[parts.length - 1];
  return chainId ? parseInt(chainId, 10) : undefined;
};

/**
 * Based on the provided account, it returns the possible source tokens.
 * Then based on the selected source token, it returns the possible target tokens.
 *
 * If the selected source token is not provided,
 * it returns the default source token (based on the DEFAULT_SOURCE_TOKENS config).
 * If a target token is specified, prioritizes source tokens from the same network.
 *
 * If the selected target token is not provided,
 * it returns the default target token based on the DEFAULT_TARGET_TOKENS config.
 */
export function useSwapTokens(
  selectedFromTokenId?: string,
  selectedToTokenId?: string,
) {
  const {
    accounts: { active },
  } = useAccountsContext();
  const sourceTokens = useSwappableTokensForAccount(active);

  // Extract the target token's chainId to prioritize source tokens from the same network
  const targetChainId = getChainIdFromTokenId(selectedToTokenId);

  // `sourceTokens` are already filtered to only include tokens with balances.
  const potentialSourceTokens = sourceTokens.filter(
    (token) =>
      token.type === TokenType.NATIVE &&
      (DEFAULT_SOURCE_TOKENS as string[]).includes(token.symbol),
  );

  // Determine default source token:
  // If target token is specified, prefer native token from the same network,
  // then any token from the same network, then fall back to general default
  const getDefaultFromToken = (): SwappableToken | undefined => {
    if (targetChainId) {
      // First: native token from the same network
      const nativeOnTargetNetwork = sourceTokens.find(
        (token) =>
          token.coreChainId === targetChainId &&
          token.type === TokenType.NATIVE,
      );
      if (nativeOnTargetNetwork) return nativeOnTargetNetwork;

      // Second: any token with balance on the same network
      const anyOnTargetNetwork = sourceTokens.find(
        (token) => token.coreChainId === targetChainId,
      );
      if (anyOnTargetNetwork) return anyOnTargetNetwork;
    }

    // Fall back to default behavior
    return potentialSourceTokens.toSorted(sortByPriority)[0];
  };

  const defaultFromToken = getDefaultFromToken();
  const fromToken =
    sourceTokens.find(
      (token) => getUniqueTokenId(token) === selectedFromTokenId,
    ) ?? defaultFromToken;

  const targetTokens = useTargetSwapTokens(fromToken);
  const defaultTargetTokenIdentifier = fromToken
    ? DEFAULT_TARGET_TOKENS[fromToken.symbol]
    : undefined;

  const toToken =
    targetTokens.find(
      (token) => getUniqueTokenId(token) === selectedToTokenId,
    ) ?? targetTokens.find(defaultTokenFinder(defaultTargetTokenIdentifier));

  return {
    targetTokens,
    sourceTokens,
    fromToken,
    toToken,
  };
}

const sortByPriority = (tokenA: SwappableToken, tokenB: SwappableToken) =>
  (DEFAULT_SOURCE_TOKENS as string[]).indexOf(tokenA.symbol) -
  (DEFAULT_SOURCE_TOKENS as string[]).indexOf(tokenB.symbol);

const defaultTokenFinder =
  (defaultTokenIdentifier?: string) => (lookupToken: FungibleTokenBalance) => {
    if (!defaultTokenIdentifier || isNativeToken(lookupToken)) {
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
