import { FungibleTokenBalance, NetworkWithCaipId } from '@core/types';

export const filterAssetsByNetworks = (
  assets: FungibleTokenBalance[],
  selectedNetworkChainIds: Set<number>,
): FungibleTokenBalance[] => {
  if (selectedNetworkChainIds.size === 0) {
    return assets;
  }
  return assets.filter((asset) =>
    selectedNetworkChainIds.has(asset.coreChainId),
  );
};

export const getAvailableNetworksFromAssets = (
  assets: FungibleTokenBalance[],
  getNetwork: (chainId: number) => NetworkWithCaipId | undefined,
): NetworkWithCaipId[] => {
  const networkMap = new Map<number, NetworkWithCaipId>();
  assets.forEach((asset) => {
    const network = getNetwork(asset.coreChainId);
    if (network && !networkMap.has(network.chainId)) {
      networkMap.set(network.chainId, network);
    }
  });

  return Array.from(networkMap.values()).sort((a, b) =>
    a.chainName.localeCompare(b.chainName),
  );
};
