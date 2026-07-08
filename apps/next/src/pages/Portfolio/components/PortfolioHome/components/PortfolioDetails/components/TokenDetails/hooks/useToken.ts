import { useAllTokensFromEnabledNetworks } from '@/hooks/useAllTokensFromEnabledNetworks';
import { TokenType } from '@avalabs/vm-module-types';
import { Network } from '@core/types';

export const useToken = (
  tokenAddress: string,
  networkId: Network['chainId'],
) => {
  const assets = useAllTokensFromEnabledNetworks(true);
  const token = assets.find((asset) => {
    if (asset.coreChainId !== networkId) {
      return false;
    }

    if (asset.type === TokenType.ERC20) {
      return asset.address.toLowerCase() === tokenAddress.toLowerCase();
    }

    if (asset.type === TokenType.NATIVE) {
      return asset.symbol.toLowerCase() === tokenAddress.toLowerCase();
    }

    return asset.address === tokenAddress;
  });

  return token;
};
