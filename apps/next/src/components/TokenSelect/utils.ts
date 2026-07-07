import {
  isAvalancheChainId,
  isPchainNetworkId,
  isXchainNetworkId,
} from '@core/common';
import { getUniqueTokenId } from '@core/types';
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

  // Compare tokenList by token IDs and verification status rather than reference
  if (prevProps.tokenList.length !== nextProps.tokenList.length) {
    return false;
  }

  const prevTokenMap = new Map(
    prevProps.tokenList.map((token) => [getUniqueTokenId(token), token]),
  );
  const nextTokenMap = new Map(
    nextProps.tokenList.map((token) => [getUniqueTokenId(token), token]),
  );

  if (prevTokenMap.size !== nextTokenMap.size) {
    return false;
  }

  for (const [id, prevToken] of prevTokenMap) {
    const nextToken = nextTokenMap.get(id);
    if (!nextToken || prevToken.isVerified !== nextToken.isVerified) {
      return false;
    }
  }

  return true;
};
