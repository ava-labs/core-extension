import { useAllTokens } from '@/hooks/useAllTokens/useAllTokens';
import { BridgeAsset } from '@avalabs/bridge-unified';
import { findMatchingBridgeAsset } from '@core/common';
import {
  FungibleTokenBalance,
  getUniqueTokenId,
  NetworkWithCaipId,
} from '@core/types';
import { useNetworkContext } from '@core/ui';
import { useMemo } from 'react';

type LookupValue = { asset: BridgeAsset; token: FungibleTokenBalance };

export function useTokenLookup(
  networkId: NetworkWithCaipId['caipId'],
  assets: BridgeAsset[],
) {
  const { getNetwork } = useNetworkContext();
  const networksForToken = useMemo(() => {
    const network = getNetwork(networkId);
    return network ? [network] : [];
  }, [networkId, getNetwork]);

  const tokens = useAllTokens(networksForToken, false);

  const tokenAndAssetLookup = useMemo(() => {
    return tokens.reduce((lookup, token) => {
      const asset = findMatchingBridgeAsset(assets, token);
      if (asset) {
        lookup.set(getUniqueTokenId(token), { asset, token });
      }
      return lookup;
    }, new Map<string, LookupValue>());
  }, [tokens, assets]);

  const transferableTokens = useMemo(
    () => Array.from(tokenAndAssetLookup.values()).map(({ token }) => token),
    [tokenAndAssetLookup],
  );

  return {
    tokens: transferableTokens,
    lookup: tokenAndAssetLookup,
    allTokens: tokens,
  };
}
