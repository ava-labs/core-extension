import { useMemo } from 'react';
import { PartialBy } from '@avalabs/vm-module-types';
import { Transfer, Quote } from '@avalabs/fusion-sdk';

import { toFusionCaipId } from '@core/common';
import { useNetworkContext } from '@core/ui';
import { FungibleTokenBalance } from '@core/types';

import { useAllTokens } from '@/hooks/useAllTokens';

import { getNetworksForTransfer } from '../lib/getNetworksForTransfer';

export const useTransferTokensLookup = (
  transferLike: Required<
    PartialBy<Transfer | Quote, 'sourceChain' | 'targetChain' | 'fees'>
  > | null,
) => {
  const { getNetwork } = useNetworkContext();

  const networks = useMemo(
    () =>
      transferLike ? getNetworksForTransfer(transferLike, getNetwork) : [],
    [transferLike, getNetwork],
  );
  const tokens = useAllTokens(networks, true);

  return useMemo(() => {
    return tokens.reduce(
      (lookup, token) => {
        // Quotes use Fusion CAIP ids (eip155:1337 for HyperCore); key the same way.
        const fusionCaipId = toFusionCaipId(token.chainCaipId);
        if (!lookup[fusionCaipId]) {
          lookup[fusionCaipId] = [];
        }

        lookup[fusionCaipId].push(token);
        return lookup;
      },
      {} satisfies Record<string, FungibleTokenBalance[]>,
    );
  }, [tokens]);
};
