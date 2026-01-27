import { TokenType } from '@avalabs/vm-module-types';

import {
  FungibleTokenBalance,
  getUniqueTokenId,
  isErc20Token,
  isNativeToken,
} from '@core/types';
import { useAccountsContext } from '@core/ui';

import { useAllTokensFromEnabledNetworks } from '@/hooks/useAllTokensFromEnabledNetworks';

import { SwappableToken } from '../types';
import { DEFAULT_SOURCE_TOKENS, DEFAULT_TARGET_TOKENS } from '../fusion-config';
import { useSwappableTokensForAccount } from './useSwappableTokensForAccount';

export function useSwapTokens(sourceTokenId?: string, targetTokenId?: string) {
  const {
    accounts: { active },
  } = useAccountsContext();
  const sourceTokens = useSwappableTokensForAccount(active);
  // `sourceTokens` are already filtered to only include tokens with balances.
  const potentialSourceTokens = sourceTokens.filter(
    (token) =>
      token.type === TokenType.NATIVE &&
      (DEFAULT_SOURCE_TOKENS as string[]).includes(token.symbol),
  );
  const defaultFromToken = potentialSourceTokens.toSorted(sortByPriority)[0];
  const fromToken =
    sourceTokens.find((token) => getUniqueTokenId(token) === sourceTokenId) ??
    defaultFromToken;

  // TODO: Replace with a call to the Token Aggregator API
  const targetTokens = useAllTokensFromEnabledNetworks();
  const defaultTargetTokenIdentifier = fromToken
    ? DEFAULT_TARGET_TOKENS[fromToken.symbol]
    : undefined;

  const toToken =
    targetTokens.find((token) => getUniqueTokenId(token) === targetTokenId) ??
    targetTokens.find(defaultTokenFinder(defaultTargetTokenIdentifier));

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
