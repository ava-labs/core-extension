import { getUniqueTokenId } from '@core/types';
import { TokenSelectProps } from './types';

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

  // Compare tokenList by token IDs rather than reference
  if (prevProps.tokenList.length !== nextProps.tokenList.length) {
    return false;
  }

  const prevTokenIds = new Set(
    prevProps.tokenList.map((token) => getUniqueTokenId(token)),
  );
  const nextTokenIds = new Set(
    nextProps.tokenList.map((token) => getUniqueTokenId(token)),
  );

  if (prevTokenIds.size !== nextTokenIds.size) {
    return false;
  }

  for (const id of prevTokenIds) {
    if (!nextTokenIds.has(id)) {
      return false;
    }
  }

  return true;
};
