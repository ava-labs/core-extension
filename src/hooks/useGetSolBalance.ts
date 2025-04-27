import { useCallback } from 'react';
import { SolanaCaip2ChainId } from '@avalabs/core-chains-sdk';

import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';
import { GetNativeBalanceHandler } from '@src/background/services/balances/handlers/getNativeBalance';

export function useGetSolBalance() {
  const { request } = useConnectionContext();

  const getSolBalance = useCallback(
    async (address: string) =>
      request<GetNativeBalanceHandler>({
        method: ExtensionRequest.BALANCE_NATIVE_GET,
        params: [address, SolanaCaip2ChainId.MAINNET],
      }),
    [request],
  );

  return {
    getSolBalance,
  };
}
