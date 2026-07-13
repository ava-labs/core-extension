import { HYPERCORE_CHAIN_ID, isHypercoreNetwork } from '@core/common';
import type { Account } from '@core/types';
import { useNetworkContext } from '@core/ui';
import { useMemo } from 'react';
import { useHypercoreBalances } from '@/lib/hypercore/hooks/useHypercoreBalances';
import {
  sumHypercoreBalanceInCurrency,
  toFungibleTokenBalances,
} from '@/lib/hypercore/toFungibleTokenBalances';

export const useHypercoreBalanceInCurrency = (account?: Account) => {
  const { getNetwork, enabledNetworks } = useNetworkContext();
  const { data: hypercoreTokens } = useHypercoreBalances({
    evmAddress: account?.addressC,
  });

  return useMemo(() => {
    const hypercoreNetwork = getNetwork(HYPERCORE_CHAIN_ID);

    if (
      !hypercoreTokens?.length ||
      !hypercoreNetwork ||
      !enabledNetworks.some(isHypercoreNetwork)
    ) {
      return 0;
    }

    return sumHypercoreBalanceInCurrency(
      toFungibleTokenBalances(hypercoreTokens, hypercoreNetwork),
    );
  }, [enabledNetworks, getNetwork, hypercoreTokens]);
};
