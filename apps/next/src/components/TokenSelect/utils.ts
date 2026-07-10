import {
  isAvalancheChainId,
  isPchainNetworkId,
  isXchainNetworkId,
} from '@core/common';
import { FungibleTokenBalance, getUniqueTokenId } from '@core/types';
import type { TokenSelectProps } from './types';

export const sortChainIds = (a: number, b: number) => {
  const aPriority = getAvalancheChainPriority(a);
  const bPriority = getAvalancheChainPriority(b);

  if (aPriority !== -1 || bPriority !== -1) {
    if (aPriority === -1) return 1;
    if (bPriority === -1) return -1;
    return aPriority - bPriority;
  }

  return a - b;
};

export const getAvalancheChainPriority = (chainId: number) => {
  if (isAvalancheChainId(chainId)) {
    return 0;
  }

  if (isPchainNetworkId(chainId)) {
    return 1;
  }

  if (isXchainNetworkId(chainId)) {
    return 2;
  }

  return -1;
};

export const getChainFilterName = (
  chainId: number,
  fallbackName = `Chain ${chainId}`,
) => {
  if (isAvalancheChainId(chainId)) {
    return 'C-Chain';
  }

  if (isPchainNetworkId(chainId)) {
    return 'P-Chain';
  }

  if (isXchainNetworkId(chainId)) {
    return 'X-Chain';
  }

  return fallbackName;
};

/**
 * Custom comparison function to prevent rerenders when tokenList reference changes
 * but the actual tokens (by ID) remain the same
 */
export const areTokenListsEqual = (
  prevProps: TokenSelectProps,
  nextProps: TokenSelectProps,
): boolean => {
  // Compare all props except tokenList
  // IMPORTANT: Also compare callbacks to ensure component re-renders when callbacks change
  // This is critical because callbacks may capture outdated closures (e.g., outdated searchParams)
  const prevFallbackId = prevProps.selectedTokenFallback
    ? getUniqueTokenId(prevProps.selectedTokenFallback)
    : undefined;
  const nextFallbackId = nextProps.selectedTokenFallback
    ? getUniqueTokenId(nextProps.selectedTokenFallback)
    : undefined;

  if (
    prevProps.id !== nextProps.id ||
    prevProps.tokenId !== nextProps.tokenId ||
    prevProps.query !== nextProps.query ||
    prevProps.hint !== nextProps.hint ||
    prevProps.chainFilterMode !== nextProps.chainFilterMode ||
    prevProps.disabled !== nextProps.disabled ||
    prevProps.selectedChainId !== nextProps.selectedChainId ||
    prevProps.isLoadingTokens !== nextProps.isLoadingTokens ||
    prevFallbackId !== nextFallbackId ||
    prevProps.onValueChange !== nextProps.onValueChange ||
    prevProps.onQueryChange !== nextProps.onQueryChange ||
    prevProps.onEndReached !== nextProps.onEndReached ||
    prevProps.externalChainOptions !== nextProps.externalChainOptions ||
    prevProps.onChainChange !== nextProps.onChainChange ||
    prevProps.onOpenChange !== nextProps.onOpenChange ||
    prevProps.defaultChainId !== nextProps.defaultChainId
  ) {
    return false;
  }

  // Compare ordered token rows by values that affect rendering or sorting.
  if (prevProps.tokenList.length !== nextProps.tokenList.length) {
    return false;
  }

  for (const [index, prevToken] of prevProps.tokenList.entries()) {
    const nextToken = nextProps.tokenList[index];
    if (!nextToken || !areTokenRowsEqual(prevToken, nextToken)) {
      return false;
    }
  }

  return true;
};

const areTokenRowsEqual = (
  prevToken: FungibleTokenBalance,
  nextToken: FungibleTokenBalance,
) =>
  getUniqueTokenId(prevToken) === getUniqueTokenId(nextToken) &&
  prevToken.name === nextToken.name &&
  prevToken.symbol === nextToken.symbol &&
  prevToken.logoUri === nextToken.logoUri &&
  prevToken.coreChainId === nextToken.coreChainId &&
  prevToken.balance === nextToken.balance &&
  prevToken.balanceDisplayValue === nextToken.balanceDisplayValue &&
  prevToken.balanceInCurrency === nextToken.balanceInCurrency &&
  prevToken.priceInCurrency === nextToken.priceInCurrency &&
  prevToken.isVerified === nextToken.isVerified;
