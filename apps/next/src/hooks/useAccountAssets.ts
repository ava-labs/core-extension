import { HYPERCORE_CHAIN_ID, isHypercoreNetwork } from '@core/common';
import type { Account, NetworkWithCaipId } from '@core/types';
import { useNetworkContext } from '@core/ui';
import { useMemo } from 'react';
import { useTokensForAccount } from '@/hooks/useTokensForAccount';
import { useHypercoreBalances } from '@/lib/hypercore/hooks/useHypercoreBalances';
import { toFungibleTokenBalances } from '@/lib/hypercore/toFungibleTokenBalances';
import { isChainIdRequested, sortFungibleTokens } from '@/lib/tokens';

type UseAccountAssetsOptions = {
  networks?: NetworkWithCaipId[];
  forceShowAllTokens?: boolean;
};

/**
 * Account portfolio assets (balance-service tokens + HyperCore rows when enabled).
 */
export const useAccountAssets = (
  account?: Account,
  options: UseAccountAssetsOptions = {},
) => {
  const { getNetwork, enabledNetworks } = useNetworkContext();
  const isHypercoreEnabled = enabledNetworks.some(isHypercoreNetwork);
  const baseAssets = useTokensForAccount(account, options);
  const { data: hypercoreTokens } = useHypercoreBalances({
    evmAddress: isHypercoreEnabled ? account?.addressC : undefined,
  });

  return useMemo(() => {
    const networks = options.networks ?? [];
    const hypercoreNetwork = getNetwork(HYPERCORE_CHAIN_ID);

    if (
      !isHypercoreEnabled ||
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
  }, [
    baseAssets,
    getNetwork,
    hypercoreTokens,
    isHypercoreEnabled,
    options.networks,
  ]);
};
