import { UnifiedBridgeService } from '@avalabs/bridge-unified';

export function getChainAssets(
  core: UnifiedBridgeService | null,
  caipId: string | undefined,
) {
  if (!core || !caipId) {
    return [];
  }

  return core.getAssets()[caipId] ?? [];
}

export function getAsset(
  core: UnifiedBridgeService | null,
  symbol: string,
  caipId: string,
) {
  const chainAssets = getChainAssets(core, caipId);

  if (chainAssets.length === 0) {
    return undefined;
  }

  return chainAssets.find((asset) => asset.symbol === symbol);
}
