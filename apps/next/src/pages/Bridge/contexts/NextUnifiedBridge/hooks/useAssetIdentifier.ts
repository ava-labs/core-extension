import { TokenType, UnifiedBridgeService } from '@avalabs/bridge-unified';
import { useCallback } from 'react';
import { getAsset } from '../utils';

export function useAssetIdentifier(core: UnifiedBridgeService | null) {
  return useCallback(
    (symbol?: string, targetChainId?: string) =>
      getAssetIdentifier(core, symbol, targetChainId),
    [core],
  );
}

function getAssetIdentifier(
  core: UnifiedBridgeService | null,
  symbol?: string,
  targetChainId?: string,
) {
  if (!symbol || !targetChainId) {
    return;
  }

  const asset = getAsset(core, symbol, targetChainId);

  if (!asset) {
    return;
  }

  return asset.type === TokenType.NATIVE ? asset.symbol : asset.address;
}
