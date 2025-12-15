import { NetworkWithCaipId } from '@core/types';

export const getNetworkCount = (
  networksWithBalance: Record<string, NetworkWithCaipId[]>,
) => {
  const allNetworks = Object.values(networksWithBalance).flat();
  const uniqueChainIds = new Set(allNetworks.map((network) => network.chainId));
  return uniqueChainIds.size;
};
