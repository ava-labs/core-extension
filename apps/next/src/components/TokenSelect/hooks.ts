import { useCallback, useMemo } from 'react';
import { FungibleTokenBalance } from '@core/types';
import { useNetworkContext } from '@core/ui';
import {
  isAvalancheChainId,
  isPchainNetworkId,
  isXchainNetworkId,
} from '@core/common';
import { ChainId } from '@avalabs/core-chains-sdk';
import { ChainOption } from './components/ChainFilterChips';
import { sortTokensByBalance } from './utils';

/**
 * Helper to check if a chain ID is any Avalanche network (C, X, or P)
 */
export const useIsAnyAvalancheNetwork = () => {
  return useCallback((chainId: number): boolean => {
    return (
      isAvalancheChainId(chainId) ||
      isPchainNetworkId(chainId) ||
      isXchainNetworkId(chainId)
    );
  }, []);
};

/**
 * Extract unique chain IDs from token list and group Avalanche networks
 */
export const useChainIds = (
  tokenList: FungibleTokenBalance[],
  isAnyAvalancheNetwork: (chainId: number) => boolean,
) => {
  return useMemo(() => {
    const chainIds = new Set(tokenList.map((token) => token.coreChainId));
    const allChainIds = Array.from(chainIds);

    // Separate Avalanche and non-Avalanche networks
    const avalancheChainIds: number[] = [];
    const nonAvalancheChainIds: number[] = [];

    allChainIds.forEach((chainId) => {
      if (isAnyAvalancheNetwork(chainId)) {
        avalancheChainIds.push(chainId);
      } else {
        nonAvalancheChainIds.push(chainId);
      }
    });

    // Sort non-Avalanche chains
    nonAvalancheChainIds.sort((a, b) => a - b);

    return {
      availableChainIds: nonAvalancheChainIds,
      hasAvalancheNetworks: avalancheChainIds.length > 0,
    };
  }, [tokenList, isAnyAvalancheNetwork]);
};

/**
 * Filter and sort token list based on selected chain
 */
export const useFilteredTokenList = (
  tokenList: FungibleTokenBalance[],
  selectedChainId: number | 'avalanche' | null,
  isAnyAvalancheNetwork: (chainId: number) => boolean,
) => {
  return useMemo(() => {
    let filtered: FungibleTokenBalance[];

    if (selectedChainId === null) {
      filtered = tokenList;
    } else if (selectedChainId === 'avalanche') {
      filtered = tokenList.filter((token) =>
        isAnyAvalancheNetwork(token.coreChainId),
      );
    } else {
      filtered = tokenList.filter(
        (token) => token.coreChainId === selectedChainId,
      );
    }

    return sortTokensByBalance(filtered);
  }, [tokenList, selectedChainId, isAnyAvalancheNetwork]);
};

/**
 * Get chain options for filter chips
 */
export const useChainOptions = (
  availableChainIds: number[],
  hasAvalancheNetworks: boolean,
) => {
  const { getNetwork } = useNetworkContext();

  return useMemo(() => {
    const options: Array<ChainOption> = [];

    // Add Avalanche option if there are Avalanche networks
    if (hasAvalancheNetworks) {
      options.push({
        chainId: 'avalanche',
        chainName: 'Avalanche',
        logoUri: getNetwork(ChainId.AVALANCHE_MAINNET_ID)?.logoUri ?? '',
      });
    }

    // Add other chain options
    availableChainIds.forEach((chainId) => {
      const network = getNetwork(chainId);
      options.push({
        chainId,
        chainName: network?.chainName ?? `Chain ${chainId}`,
        logoUri: network?.logoUri,
      });
    });

    return options;
  }, [availableChainIds, hasAvalancheNetworks, getNetwork]);
};
