import { ExtensionRequest } from '@core/types';
import { BridgeContext, useConnectionContext } from '@core/ui';
import { useCallback } from 'react';
import { BridgeRemoveTransactionHandler } from '~/services/bridge/handlers/removeBridgeTransaction';

export const useUntrackTransaction = () => {
  const { request } = useConnectionContext();
  return useCallback<BridgeContext['removeBridgeTransaction']>(
    async (txHash) => {
      await request<BridgeRemoveTransactionHandler>({
        method: ExtensionRequest.BRIDGE_TRANSACTION_REMOVE,
        params: [txHash],
      });
    },
    [request],
  );
};
