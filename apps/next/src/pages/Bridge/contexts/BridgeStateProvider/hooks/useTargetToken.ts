import { BridgeAsset, TokenType } from '@avalabs/bridge-unified';
import { findMatchingBridgeAsset } from '@core/common';
import { useMemo } from 'react';
import { useNetworkTokens } from './useNetworkTokens';

export function useTargetToken(
  targetNetworkId: string,
  assets: BridgeAsset[],
  selectedAsset: BridgeAsset | undefined,
) {
  const tokens = useNetworkTokens(targetNetworkId);

  const matchedAssets = useMemo(
    () =>
      selectedAsset
        ? assets.filter(
            (a) =>
              a.symbol === getWrappedSymbol(selectedAsset) ||
              a.name === selectedAsset.name,
          )
        : [],
    [assets, selectedAsset],
  );

  const matchedToken = useMemo(
    () =>
      selectedAsset
        ? tokens.find((t) => findMatchingBridgeAsset(matchedAssets, t))
        : undefined,
    [selectedAsset, tokens, matchedAssets],
  );

  return matchedToken;
}

const getWrappedSymbol = (asset: BridgeAsset) => {
  if (asset.type !== TokenType.NATIVE) {
    if (asset.symbol === 'WETH.e') {
      return 'ETH';
    }

    return asset.symbol;
  }

  // Ethereum
  if (asset.symbol === 'ETH') {
    return 'WETH.e';
  }

  return asset.symbol;
};
