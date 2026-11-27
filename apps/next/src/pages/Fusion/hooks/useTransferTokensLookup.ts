import { useMemo } from 'react';
import { PartialBy } from '@avalabs/vm-module-types';
import { Transfer, Quote, TokenType } from '@avalabs/fusion-sdk';

import { toFusionCaipId } from '@core/common';
import { useNetworkContext } from '@core/ui';
import { FungibleTokenBalance } from '@core/types';

import { getNetworksForTransfer } from '../lib/getNetworksForTransfer';

import { useTokensLookup, type TokensLookupRequest } from './useTokensLookup';

type TransferLike = Required<
  PartialBy<Transfer | Quote, 'sourceChain' | 'targetChain' | 'fees'>
>;

type AssetRef = { type: TokenType; address?: string };

const getReferencedAddresses = (transferLike: TransferLike) => {
  const byChain = new Map<string, string[]>();
  const add = (chainId: string, asset: AssetRef) => {
    if (asset.type === TokenType.NATIVE || !asset.address) {
      return;
    }

    byChain.set(chainId, [...(byChain.get(chainId) ?? []), asset.address]);
  };

  const input = 'assetIn' in transferLike ? transferLike.assetIn : undefined;
  const output = 'assetOut' in transferLike ? transferLike.assetOut : undefined;
  const source =
    input ?? ('sourceAsset' in transferLike ? transferLike.sourceAsset : null);
  const target =
    output ?? ('targetAsset' in transferLike ? transferLike.targetAsset : null);

  if (source) add(transferLike.sourceChain.chainId, source as AssetRef);
  if (target) add(transferLike.targetChain.chainId, target as AssetRef);

  for (const fee of transferLike.fees) {
    add(fee.chainId, fee.token as AssetRef);
  }

  return byChain;
};

export const useTransferTokensLookup = (transferLike: TransferLike | null) => {
  const { getNetwork } = useNetworkContext();

  const requests = useMemo<TokensLookupRequest[]>(() => {
    if (!transferLike) {
      return [];
    }

    const addressesByChain = getReferencedAddresses(transferLike);

    return getNetworksForTransfer(transferLike, getNetwork).map((network) => ({
      network,
      addresses: [
        ...(addressesByChain.get(toFusionCaipId(network.caipId)) ?? []),
        ...(addressesByChain.get(network.caipId) ?? []),
      ],
    }));
  }, [transferLike, getNetwork]);

  const { tokensByCaipId, isPending } = useTokensLookup(requests);

  const tokensByChainId = useMemo(() => {
    return Object.values(tokensByCaipId).reduce(
      (lookup, tokens) => {
        for (const token of tokens) {
          // Quotes use Fusion CAIP ids (eip155:1337 for HyperCore); key the same way.
          const fusionCaipId = toFusionCaipId(token.chainCaipId);
          (lookup[fusionCaipId] ??= []).push(token);
        }

        return lookup;
      },
      {} as Record<string, FungibleTokenBalance[]>,
    );
  }, [tokensByCaipId]);

  return { tokensByChainId, isPending };
};
