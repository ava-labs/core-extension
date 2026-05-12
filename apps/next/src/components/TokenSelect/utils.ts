import { getUniqueTokenId } from '@core/types';
import type { TokenSelectProps } from './types';

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
  if (
    prevProps.id !== nextProps.id ||
    prevProps.tokenId !== nextProps.tokenId ||
    prevProps.query !== nextProps.query ||
    prevProps.hint !== nextProps.hint ||
    prevProps.disabled !== nextProps.disabled ||
    prevProps.onValueChange !== nextProps.onValueChange ||
    prevProps.onQueryChange !== nextProps.onQueryChange
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
