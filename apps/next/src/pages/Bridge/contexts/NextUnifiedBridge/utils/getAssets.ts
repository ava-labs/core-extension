import { UnifiedBridgeService } from '@avalabs/bridge-unified';

export function getChainAssets(
  core: UnifiedBridgeService | null,
  chainId: string | undefined,
) {
  if (!core || !chainId) {
    return [];
  }

  return core.getAssets()[chainId] ?? [];
}

export function getAsset(
  core: UnifiedBridgeService | null,
  symbol: string,
  chainId: string,
) {
  const chainAssets = getChainAssets(core, chainId);

  if (chainAssets.length === 0) {
    return undefined;
  }

  return chainAssets.find((asset) => asset.symbol === symbol);
}
