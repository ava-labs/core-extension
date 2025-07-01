import { useCallback } from 'react';
import { GetNativeBalanceHandler } from '@core/service-worker';
import { TokenWithBalance } from '@avalabs/vm-module-types';
import { ExtensionRequest } from '@core/types';

import { useConnectionContext } from '../contexts';

type NativeBalanceFetcher = {
  fetchBalance: (address: string) => Promise<TokenWithBalance>;
};

export function useNativeBalanceFetcher(
  chainCaipId: string,
): NativeBalanceFetcher {
  const { request } = useConnectionContext();

  const fetchBalance = useCallback(
    async (address: string) => {
      const { balance } = await request<GetNativeBalanceHandler>({
        method: ExtensionRequest.BALANCE_NATIVE_GET,
        params: [address, chainCaipId],
      });
      return balance;
    },
    [request, chainCaipId],
  );

  return {
    fetchBalance,
  };
}
