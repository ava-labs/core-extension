import { useCallback } from 'react';
import { AvalancheCaip2ChainId } from '@avalabs/core-chains-sdk';
import { GetNativeBalanceHandler } from '@core/service-worker';
import { ExtensionRequest } from '@core/types';
import { useConnectionContext } from '@core/ui';
import { isFulfilled } from '@core/common';

/**
 * Checks whether a given X/P-chain address has any native balance
 * on either the X-chain or P-chain (mainnet).
 *
 * The address should include the chain prefix (e.g. "X-avax1...").
 * The same bech32 body is shared between X and P chains.
 */
export const useCheckXPAddressBalance = () => {
  const { request } = useConnectionContext();

  return useCallback(
    async (xpAddress: string): Promise<boolean> => {
      const checkBalance = async (caip2Id: string): Promise<boolean> => {
        try {
          const { balance } = await request<GetNativeBalanceHandler>({
            method: ExtensionRequest.BALANCE_NATIVE_GET,
            params: [xpAddress, caip2Id],
          });
          return balance.balance > 0n;
        } catch {
          return false;
        }
      };
      const hasActivity = (
        await Promise.allSettled([
          checkBalance(AvalancheCaip2ChainId.X),
          checkBalance(AvalancheCaip2ChainId.P),
        ])
      )
        .filter(isFulfilled)
        .some((result) => result.value);
      return hasActivity;
    },
    [request],
  );
};
