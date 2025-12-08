import { useCallback } from 'react';
import { GetNativeBalanceHandler } from '@core/service-worker';
import {
  NetworkTokenWithBalance,
  TokenWithBalance,
} from '@avalabs/vm-module-types';
import { ExtensionRequest } from '@core/types';

import { useConnectionContext } from '../contexts';

type NativeBalanceFetcher = {
  fetchBalance: (address: string) => Promise<TokenWithBalance>;
};

const memoryCache = new Map<string, NetworkTokenWithBalance>();

export function useNativeBalanceFetcher(
  chainCaipId: string,
): NativeBalanceFetcher {
  const { request } = useConnectionContext();

  const fetchBalance = useCallback(
    async (address: string) => {
      if (memoryCache.has(address)) {
        return memoryCache.get(address)!;
      }

      const { balance } = await request<GetNativeBalanceHandler>({
        method: ExtensionRequest.BALANCE_NATIVE_GET,
        params: [address, chainCaipId],
      });
      memoryCache.set(address, balance);
      return balance;
    },
    [request, chainCaipId],
  );

  return {
    fetchBalance,
  };
}
