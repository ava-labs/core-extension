import { useAllTokens } from '@/hooks/useAllTokens';
import { BridgeAsset } from '@avalabs/bridge-unified';
import { findMatchingBridgeAsset } from '@core/common';
import { useNetworkContext } from '@core/ui';
import { useMemo } from 'react';

// TODO: Find the actual target token based on the source token and the target network
export function useTargetToken(
  targetNetworkId: string,
  assets: BridgeAsset[],
  selectedAsset: BridgeAsset | undefined,
) {
  const { getNetwork } = useNetworkContext();

  const networks = useMemo(() => {
    const network = getNetwork(targetNetworkId);
    return network ? [network] : [];
  }, [targetNetworkId, getNetwork]);

  const tokens = useAllTokens(networks, false);

  const matchedAssets = useMemo(
    () =>
      selectedAsset
        ? assets.filter(
            (a) =>
              a.symbol === selectedAsset.symbol ||
              a.name === selectedAsset.name,
          )
        : [],
    [assets, selectedAsset],
  );

  const matchedToken = useMemo(
    () =>
      selectedAsset
        ? tokens.find(
            (t) =>
              t.symbol === selectedAsset.symbol ||
              t.name === selectedAsset.name ||
              findMatchingBridgeAsset(matchedAssets, t),
          )
        : undefined,
    [selectedAsset, tokens, matchedAssets],
  );

  return matchedToken;
}
