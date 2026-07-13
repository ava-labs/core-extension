import { HYPERCORE_CHAIN_ID } from '@core/common';
import type { Account, NetworkWithCaipId } from '@core/types';
import { useNetworkContext } from '@core/ui';
import { useMemo } from 'react';
import { useTokensForAccount } from '@/hooks/useTokensForAccount';
import { useHypercoreBalances } from '@/lib/hypercore/hooks/useHypercoreBalances';
import { toFungibleTokenBalances } from '@/lib/hypercore/toFungibleTokenBalances';
import { isChainIdRequested, sortFungibleTokens } from '@/lib/tokens';

type UseHypercoreAssetsOptions = {
  networks?: NetworkWithCaipId[];
  forceShowAllTokens?: boolean;
};

export const useHypercoreAssets = (
  account?: Account,
  options: UseHypercoreAssetsOptions = {},
) => {
  const { getNetwork } = useNetworkContext();
  const baseAssets = useTokensForAccount(account, options);
  const { data: hypercoreTokens } = useHypercoreBalances({
    evmAddress: account?.addressC,
  });

  return useMemo(() => {
    const networks = options.networks ?? [];
    const hypercoreNetwork = getNetwork(HYPERCORE_CHAIN_ID);

    if (
      !hypercoreTokens?.length ||
      !hypercoreNetwork ||
      !isChainIdRequested(HYPERCORE_CHAIN_ID, networks)
    ) {
      return baseAssets;
    }

    const hypercoreAssets = toFungibleTokenBalances(
      hypercoreTokens,
      hypercoreNetwork,
    );

    return sortFungibleTokens([...baseAssets, ...hypercoreAssets]);
  }, [baseAssets, getNetwork, hypercoreTokens, options.networks]);
};
