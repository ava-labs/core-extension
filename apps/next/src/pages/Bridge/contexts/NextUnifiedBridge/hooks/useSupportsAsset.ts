import { TokenType, UnifiedBridgeService } from '@avalabs/bridge-unified';
import { NetworkWithCaipId } from '@core/types';
import { useCallback } from 'react';
import { getChainAssets } from '../utils';

export function useSupportsAsset(
  core: UnifiedBridgeService | null,
  sourceNetwork: NetworkWithCaipId | undefined,
) {
  const supportsAsset = useCallback(
    (lookupAddressOrSymbol: string, targetChainId: string) => {
      return getSupportsAssets(
        core,
        sourceNetwork?.caipId,
        targetChainId,
        lookupAddressOrSymbol,
      );
    },
    [core, sourceNetwork?.caipId],
  );

  return supportsAsset;
}

function getSupportsAssets(
  core: UnifiedBridgeService | null,
  sourceNetworkId: string | undefined,
  targetChainId: string,
  lookupAddressOrSymbol: string,
) {
  const sourceAssets = getChainAssets(core, sourceNetworkId);

  if (sourceAssets.length === 0) {
    return false;
  }

  const asset = sourceAssets.find((token) => {
    return token.type === TokenType.NATIVE
      ? token.symbol === lookupAddressOrSymbol
      : token.address === lookupAddressOrSymbol;
  });

  return Boolean(asset && targetChainId in asset.destinations);
}
