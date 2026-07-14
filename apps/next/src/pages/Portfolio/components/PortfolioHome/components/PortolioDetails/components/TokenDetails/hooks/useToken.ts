import { useAllTokensFromEnabledNetworks } from '@/hooks/useAllTokensFromEnabledNetworks';
import { TokenType } from '@avalabs/vm-module-types';
import { Network } from '@core/types';
import { useMemo } from 'react';

const matchesTokenAddress = (
  asset: {
    type: TokenType;
    symbol: string;
    address?: string;
    index?: number;
  },
  tokenAddress: string,
) => {
  if (asset.type === TokenType.ERC20 && asset.address) {
    return asset.address.toLowerCase() === tokenAddress.toLowerCase();
  }

  if (asset.type === TokenType.NATIVE) {
    return asset.symbol.toLowerCase() === tokenAddress.toLowerCase();
  }

  if (asset.type === TokenType.HYPERCORE_SPOT) {
    return (
      tokenAddress === `spot:${asset.index}` ||
      asset.symbol.toLowerCase() === tokenAddress.toLowerCase()
    );
  }

  return asset.address === tokenAddress;
};

export const useToken = (
  tokenAddress: string,
  networkId: Network['chainId'],
) => {
  const assets = useAllTokensFromEnabledNetworks(true);

  return useMemo(
    () =>
      assets.find(
        (asset) =>
          asset.coreChainId === networkId &&
          matchesTokenAddress(asset, tokenAddress),
      ),
    [assets, networkId, tokenAddress],
  );
};
