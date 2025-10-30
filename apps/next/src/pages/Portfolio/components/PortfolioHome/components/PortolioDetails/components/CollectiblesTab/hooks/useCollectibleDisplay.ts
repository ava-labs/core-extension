import type { EvmCollectible } from '~/balances/evm/types/evmBalanceTypes';
import { useCollectibleDoubleHop } from './useCollectibleDoubleHop';

/**
 * Hook to prepare collectible data for display
 * @param collectible The raw collectible data
 * @returns Enhanced collectible with display properties and loading state
 */
export function useCollectibleDisplay(collectible: EvmCollectible) {
  const {
    collectible: enhancedCollectible,
    isLoading,
    refetch,
  } = useCollectibleDoubleHop(collectible);

  // Check if the collectible has unreachable or invalid token URI
  const isUnreachable =
    enhancedCollectible.metadata?.indexStatus === 'UNREACHABLE_TOKEN_URI' ||
    enhancedCollectible.metadata?.indexStatus === 'INVALID_TOKEN_URI_SCHEME';

  // Show error if URI is unreachable or no preview URI is available
  const showError = isUnreachable || !enhancedCollectible.previewUri;

  // Extract name and collection name
  const name =
    enhancedCollectible.metadata?.name || enhancedCollectible.name || 'Unnamed';

  return {
    enhancedCollectible,
    isLoading,
    refetch,
    isUnreachable,
    showError,
    name,
  };
}
