import { useCallback, useMemo } from 'react';

import type { FungibleTokenBalance, NetworkWithCaipId } from '@core/types';

import { useTokensLookup } from './useTokensLookup';

type UseRecurringOrderTokensParams = {
  network: NetworkWithCaipId | undefined;
  tokenAddresses: string[];
  enabled: boolean;
};

export const useRecurringOrderTokens = ({
  network,
  tokenAddresses,
  enabled,
}: UseRecurringOrderTokensParams) => {
  const requests = useMemo(
    () => (network ? [{ network, addresses: tokenAddresses }] : []),
    [network, tokenAddresses],
  );
  const { resolveToken } = useTokensLookup(requests, { enabled });

  return useCallback(
    (tokenAddress: string): FungibleTokenBalance | undefined =>
      network ? resolveToken(network.caipId, tokenAddress) : undefined,
    [network, resolveToken],
  );
};
