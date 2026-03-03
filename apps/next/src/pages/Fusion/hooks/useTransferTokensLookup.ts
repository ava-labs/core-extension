import { useMemo } from 'react';
import { PartialBy } from '@avalabs/vm-module-types';
import { Transfer, Quote } from '@avalabs/unified-asset-transfer';

import { useNetworkContext } from '@core/ui';
import { FungibleTokenBalance } from '@core/types';

import { useAllTokens } from '@/hooks/useAllTokens';

import { getNetworksForTransfer } from '../lib/getNetworksForTransfer';

export const useTransferTokensLookup = (
  transferLike: Required<
    PartialBy<Transfer | Quote, 'sourceChain' | 'targetChain' | 'fees'>
  >,
) => {
  const { getNetwork } = useNetworkContext();

  const networks = useMemo(
    () => getNetworksForTransfer(transferLike, getNetwork),
    [transferLike, getNetwork],
  );
  const tokens = useAllTokens(networks, true);

  return useMemo(() => {
    return tokens.reduce(
      (lookup, token) => {
        if (!lookup[token.chainCaipId]) {
          lookup[token.chainCaipId] = [];
        }

        lookup[token.chainCaipId].push(token);
        return lookup;
      },
      {} satisfies Record<string, FungibleTokenBalance[]>,
    );
  }, [tokens]);
};
