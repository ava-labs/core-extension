import { TokenType } from '@avalabs/vm-module-types';

import {
  Account,
  FungibleTokenBalance,
  getUniqueTokenId,
  isErc20Token,
  isNativeToken,
} from '@core/types';

import { SwappableToken } from '../types';
import { DEFAULT_SOURCE_TOKENS, DEFAULT_TARGET_TOKENS } from '../swap-config';
import { useTargetSwapTokens } from './useTargetSwapTokens';
import { useSwappableTokensForAccount } from './useSwappableTokensForAccount';

/**
 * Based on the provided account, it returns the possible source tokens.
 * Then based on the selected source token, it returns the possible target tokens.
 *
 * If the selected source token is not provided,
 * it returns the default source token (based on the DEFAULT_SOURCE_TOKENS config).
 *
 * If the selected target token is not provided,
 * it returns the default target token based on the DEFAULT_TARGET_TOKENS config.
 */
export function useSwapTokens(
  activeAccount?: Account,
  selectedFromTokenId?: string,
  selectedToTokenId?: string,
) {
  const sourceTokens = useSwappableTokensForAccount(activeAccount);
  // `sourceTokens` are already filtered to only include tokens with balances.
  const potentialSourceTokens = sourceTokens.filter(
    (token) =>
      token.type === TokenType.NATIVE &&
      (DEFAULT_SOURCE_TOKENS as string[]).includes(token.symbol),
  );
  const defaultFromToken = potentialSourceTokens.toSorted(sortByPriority)[0];
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
