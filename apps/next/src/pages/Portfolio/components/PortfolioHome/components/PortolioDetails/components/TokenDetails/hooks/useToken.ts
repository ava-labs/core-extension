import { useAllTokensFromEnabledNetworks } from '@/hooks/useAllTokensFromEnabledNetworks';
import { useHypercoreBalances } from '@/lib/hypercore/hooks/useHypercoreBalances';
import { toFungibleTokenBalances } from '@/lib/hypercore/toFungibleTokenBalances';
import { TokenType } from '@avalabs/vm-module-types';
import { HYPERCORE_CHAIN_ID } from '@core/common';
import { Network } from '@core/types';
import { useAccountsContext, useNetworkContext } from '@core/ui';
import { useMemo } from 'react';

const matchesTokenAddress = (
  asset: {
    type: TokenType;
    symbol: string;
    address?: string;
  },
  tokenAddress: string,
) => {
  if (asset.type === TokenType.ERC20 && asset.address) {
    return asset.address.toLowerCase() === tokenAddress.toLowerCase();
  }

  if (asset.type === TokenType.NATIVE) {
    return asset.symbol.toLowerCase() === tokenAddress.toLowerCase();
  }

  return asset.address === tokenAddress;
};

export const useToken = (
  tokenAddress: string,
  networkId: Network['chainId'],
) => {
  const assets = useAllTokensFromEnabledNetworks(true);
  const {
    accounts: { active },
  } = useAccountsContext();
  const { getNetwork } = useNetworkContext();
  const { data: hypercoreTokens } = useHypercoreBalances({
    evmAddress: networkId === HYPERCORE_CHAIN_ID ? active?.addressC : undefined,
  });

  const hypercoreAssets = useMemo(() => {
    if (networkId !== HYPERCORE_CHAIN_ID || !hypercoreTokens?.length) {
      return [];
    }

    return toFungibleTokenBalances(
      hypercoreTokens,
      getNetwork(HYPERCORE_CHAIN_ID),
    );
  }, [getNetwork, hypercoreTokens, networkId]);

  return useMemo(() => {
    const candidates =
      networkId === HYPERCORE_CHAIN_ID
        ? [...hypercoreAssets, ...assets]
        : assets;

    return candidates.find(
      (asset) =>
        asset.coreChainId === networkId &&
        matchesTokenAddress(asset, tokenAddress),
    );
  }, [assets, hypercoreAssets, networkId, tokenAddress]);
};
