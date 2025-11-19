import { BridgeAsset, TokenType } from '@avalabs/bridge-unified';
import { caipToChainId, findMatchingBridgeAsset } from '@core/common';
import { FungibleTokenBalance } from '@core/types';
import { useMemo } from 'react';
import { useNetworkTokens } from './useNetworkTokens';

export function useTargetToken(
  targetNetworkId: string,
  targetNetworkAssets: BridgeAsset[],
  selectedSourceNetworkAsset: BridgeAsset | undefined,
  selectedSourceToken: FungibleTokenBalance | undefined,
) {
  const tokens = useNetworkTokens(targetNetworkId);

  const matchedAssets = useMemo(
    () =>
      selectedSourceNetworkAsset
        ? targetNetworkAssets.filter(
            (a) =>
              a.symbol === getWrappedSymbol(selectedSourceNetworkAsset) ||
              a.name === selectedSourceNetworkAsset.name,
          )
        : [],
    [targetNetworkAssets, selectedSourceNetworkAsset],
  );

  const matchedToken = useMemo(
    () =>
      selectedSourceNetworkAsset && selectedSourceToken
        ? (tokens.find((t) => findMatchingBridgeAsset(matchedAssets, t)) ??
          getFallbackToken(
            selectedSourceToken,
            selectedSourceNetworkAsset,
            targetNetworkId,
          ))
        : undefined,
    [
      selectedSourceNetworkAsset,
      selectedSourceToken,
      tokens,
      targetNetworkId,
      matchedAssets,
    ],
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

const getFallbackToken = (
  sourceToken: FungibleTokenBalance,
  asset: BridgeAsset,
  targetNetworkId: string,
): FungibleTokenBalance | undefined => {
  if (!targetNetworkId) {
    return undefined;
  }

  return {
    ...sourceToken,
    symbol: getWrappedSymbol(asset),
    coreChainId: caipToChainId(targetNetworkId),
  };
};
