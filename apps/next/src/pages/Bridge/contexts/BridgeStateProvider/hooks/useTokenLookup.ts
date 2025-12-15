import { BridgeAsset } from '@avalabs/bridge-unified';
import { findMatchingBridgeAsset } from '@core/common';
import {
  FungibleTokenBalance,
  getUniqueTokenId,
  NetworkWithCaipId,
} from '@core/types';
import { useMemo } from 'react';
import { useNetworkTokens } from './useNetworkTokens';
import { useSettingsContext } from '@core/ui';

type LookupValue = { asset: BridgeAsset; token: FungibleTokenBalance };

export function useTokenLookup(
  networkId: NetworkWithCaipId['caipId'],
  assets: BridgeAsset[],
) {
  const tokens = useNetworkTokens(networkId);
  const { getTokenVisibility } = useSettingsContext();

  const tokenAndAssetLookup = useMemo(() => {
    return tokens.reduce((lookup, token) => {
      const asset = findMatchingBridgeAsset(assets, token);
      if (asset) {
        lookup.set(getUniqueTokenId(token), { asset, token });
      }
      return lookup;
    }, new Map<string, LookupValue>());
  }, [tokens, assets]);

  return useMemo(
    () => ({
      tokens: Array.from(tokenAndAssetLookup.values())
        .map(({ token }) => token)
        .filter((token) => getTokenVisibility(token, networkId)),
      get: (tokenId: string) => tokenAndAssetLookup.get(tokenId),
    }),
    [tokenAndAssetLookup, getTokenVisibility, networkId],
  );
}
