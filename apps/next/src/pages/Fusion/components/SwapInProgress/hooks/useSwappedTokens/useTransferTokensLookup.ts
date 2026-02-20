import { useMemo } from 'react';
import { Transfer } from '@avalabs/unified-asset-transfer';

import { useNetworkContext } from '@core/ui';
import { FungibleTokenBalance } from '@core/types';

import { useAllTokens } from '@/hooks/useAllTokens';

import { getNetworksForTransfer } from './lib/getNetworksForTransfer';

export const useTransferTokensLookup = (transfer: Transfer) => {
  const { getNetwork } = useNetworkContext();

  const networks = useMemo(
    () => getNetworksForTransfer(transfer, getNetwork),
    [transfer, getNetwork],
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
