import { useMemo } from 'react';

import { useNetworkContext } from '@core/ui';
import { FungibleTokenBalance, getUniqueTokenId } from '@core/types';

import { useAllTokens } from '@/hooks/useAllTokens';

/**
 * @param chainIds - The chain IDs to filter the tokens by.
 * @returns All known, fungible tokens that live on provided networks.
 */
export const useSwapTargetTokenList = (
  chainIds: string | string[],
  sourceToken?: FungibleTokenBalance,
): FungibleTokenBalance[] => {
  const { networks } = useNetworkContext();

  const supportedNetworks = useMemo(
    () =>
      Object.values(networks).filter((network) =>
        Array.isArray(chainIds)
          ? chainIds.includes(network.caipId)
          : chainIds === network.caipId,
      ),
    [networks, chainIds],
  );

  const allTokens = useAllTokens(supportedNetworks, true);

  return useMemo(() => {
    if (sourceToken) {
      const sourceTokenId = getUniqueTokenId(sourceToken);

      return allTokens.filter(
        (token) => getUniqueTokenId(token) !== sourceTokenId,
      );
    }

    return allTokens;
  }, [allTokens, sourceToken]);
};
