import { HYPERCORE_CHAIN_ID, isHypercoreNetwork } from '@core/common';
import type { Account, NetworkWithCaipId } from '@core/types';
import { useNetworkContext } from '@core/ui';
import { useMemo } from 'react';
import type { HypercoreTokenBalance } from '@avalabs/hypercore-module';
import {
  useHypercoreBalances,
  useHypercoreTokensForAddresses,
} from '@/lib/hypercore/hooks/useHypercoreBalances';
import {
  sumHypercoreBalanceInCurrency,
  toFungibleTokenBalances,
} from '@/lib/hypercore/toFungibleTokenBalances';

export const sumHypercoreTokensInCurrency = ({
  hypercoreTokens,
  hypercoreNetwork,
  isHypercoreEnabled,
}: {
  hypercoreTokens: readonly HypercoreTokenBalance[] | undefined;
  hypercoreNetwork: NetworkWithCaipId | undefined;
  isHypercoreEnabled: boolean;
}) => {
  if (!hypercoreTokens?.length || !hypercoreNetwork || !isHypercoreEnabled) {
    return 0;
  }

  return sumHypercoreBalanceInCurrency(
    toFungibleTokenBalances(hypercoreTokens, hypercoreNetwork),
  );
};

export const useHypercoreBalanceInCurrency = (account?: Account) => {
  const { getNetwork, enabledNetworks } = useNetworkContext();
  const isHypercoreEnabled = enabledNetworks.some(isHypercoreNetwork);
  const { data: hypercoreTokens } = useHypercoreBalances({
    evmAddress: isHypercoreEnabled ? account?.addressC : undefined,
  });

  return useMemo(() => {
    return sumHypercoreTokensInCurrency({
      hypercoreTokens,
      hypercoreNetwork: getNetwork(HYPERCORE_CHAIN_ID),
      isHypercoreEnabled,
    });
  }, [getNetwork, hypercoreTokens, isHypercoreEnabled]);
};

export const useHypercoreBalanceInCurrencyForAddresses = (
  evmAddresses: readonly string[],
) => {
  const { getNetwork, enabledNetworks } = useNetworkContext();
  const isHypercoreEnabled = enabledNetworks.some(isHypercoreNetwork);
  const { tokens: hypercoreTokens } = useHypercoreTokensForAddresses({
    evmAddresses: isHypercoreEnabled ? evmAddresses : [],
  });

  return useMemo(() => {
    return sumHypercoreTokensInCurrency({
      hypercoreTokens,
      hypercoreNetwork: getNetwork(HYPERCORE_CHAIN_ID),
      isHypercoreEnabled,
    });
  }, [getNetwork, hypercoreTokens, isHypercoreEnabled]);
};
