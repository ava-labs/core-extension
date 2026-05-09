import { useMemo } from 'react';

import { useNetworkContext } from '@core/ui';
import { FungibleTokenBalance, getUniqueTokenId } from '@core/types';

import { useAllTokens } from '@/hooks/useAllTokens';
import { GetSupportedChainsResult } from '@avalabs/fusion-sdk';
import { isNotNullish } from '@core/common';
import { getConstrainedTargetTokenId } from '../../lib/getConstrainedTargetTokenId';

/**
 * @param supportedChainsMap - Map of supported source chain IDs to their allowed target chain IDs.
 * @returns All known, fungible tokens that live on the supported target networks,
 *          sorted verified-first so the TokenSelect separator renders correctly.
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
    let filtered: FungibleTokenBalance[];

    if (sourceToken) {
      const constrainedTargetTokenId = getConstrainedTargetTokenId(sourceToken);

      if (constrainedTargetTokenId) {
        filtered = allTokens.filter(
          (token) => getUniqueTokenId(token) === constrainedTargetTokenId,
        );
      } else {
        const sourceTokenId = getUniqueTokenId(sourceToken);
        filtered = allTokens.filter(
          (token) => getUniqueTokenId(token) !== sourceTokenId,
        );
      }
    } else {
      filtered = allTokens;
    }

    const verified = filtered.filter((t) => t.isVerified !== false);
    const unverified = filtered.filter((t) => t.isVerified === false);

    return [...verified, ...unverified];
  }, [allTokens, sourceToken]);
};
