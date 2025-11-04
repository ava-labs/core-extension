import { FormattedCollectible } from '../CollectiblesTab';
import { useCollectibleDoubleHop } from './useCollectibleDoubleHop';

/**
 * Hook to prepare collectible data for display
 * @param collectible The raw collectible data
 * @returns Enhanced collectible with display properties and loading state
 */
export function useCollectibleDisplay(collectible: FormattedCollectible) {
  const {
    collectible: enhancedCollectible,
    isLoading,
    error,
  } = useCollectibleDoubleHop(collectible);

  // Show error if no logoUri is available or there's an error
  const showError = !enhancedCollectible.logoUri || error !== null;

  // Extract name - use collectible name or default
  const name = enhancedCollectible.name || 'Unnamed';

  return {
    enhancedCollectible,
    isLoading,
    showError,
    name,
  };
}
