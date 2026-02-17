import { useMemo } from 'react';

import { useNetworkContext } from '@core/ui';
import { FungibleTokenBalance, getUniqueTokenId } from '@core/types';

import { useAllTokens } from '@/hooks/useAllTokens';
import { GetSupportedChainsResult } from '@avalabs/unified-asset-transfer';
import { isNotNullish } from '@core/common';

/**
 * @param chainIds - The chain IDs to filter the tokens by.
 * @returns All known, fungible tokens that live on provided networks.
 */
export const useSwapTargetTokenList = (
  supportedChainsMap: GetSupportedChainsResult,
  sourceToken?: FungibleTokenBalance,
): FungibleTokenBalance[] => {
  const { getNetwork } = useNetworkContext();

  const supportedTargetChainIds = useMemo(() => {
    if (sourceToken) {
      const sourceChainIdsSet = supportedChainsMap.get(
        sourceToken.chainCaipId as `${string}:${string}`,
      );
      return sourceChainIdsSet?.values().toArray() ?? [];
    }

    return supportedChainsMap
      .values()
      .toArray()
      .flatMap((chainIds) => Array.from(chainIds));
  }, [supportedChainsMap, sourceToken]);

  const supportedTargetNetworks = useMemo(
    () => supportedTargetChainIds.map(getNetwork).filter(isNotNullish),
    [getNetwork, supportedTargetChainIds],
  );

  const allTokens = useAllTokens(supportedTargetNetworks, true);

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
