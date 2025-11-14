import { FormattedCollectible } from '../CollectiblesTab';
import { useCollectibleDoubleHop } from './useCollectibleDoubleHop';
import { isNil } from 'lodash';

/**
 * Hook to prepare collectible data for display
 * @param collectible The raw collectible data
 * @returns Enhanced collectible with display properties and loading state
 */
export function useCollectibleDisplay(collectible: FormattedCollectible) {
  const {
    collectible: enhancedCollectible,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useCollectibleDoubleHop(collectible);

  // Get unreachable flag from enhanced collectible
  const isUnreachable =
    enhancedCollectible.metadata?.indexStatus === 'UNREACHABLE_TOKEN_URI' ||
    enhancedCollectible.metadata?.indexStatus === 'INVALID_TOKEN_URI_SCHEME';

  const showError =
    isUnreachable || !enhancedCollectible.logoUri || !isNil(error);

  // Extract name - use collectible name or collectionName or default
  const name = enhancedCollectible.name || enhancedCollectible.collectionName;

  return {
    enhancedCollectible,
    isLoading,
    isFetching,
    refetch,
    isUnreachable,
    showError,
    name,
  };
}
