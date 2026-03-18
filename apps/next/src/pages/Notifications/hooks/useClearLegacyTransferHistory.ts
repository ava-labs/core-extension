import { useCallback, useMemo } from 'react';
import { useMutation } from '@tanstack/react-query';

import { ExtensionRequest } from '@core/types';
import { useConnectionContext } from '@core/ui';
import type { BridgeRemoveTransactionHandler } from '@core/service-worker';

import { useNextUnifiedBridgeContext } from '@/pages/Bridge/contexts';

export function useClearLegacyTransferHistory() {
  const { request } = useConnectionContext();
  const {
    state: { pendingTransfers: legacyTransfers },
  } = useNextUnifiedBridgeContext();

  const finalizedTransfers = useMemo(() => {
    return Object.values(legacyTransfers).filter(
      (transfer) => transfer.completedAt,
    );
  }, [legacyTransfers]);

  const untrackTransaction = useCallback(
    async (txHash: string) => {
      await request<BridgeRemoveTransactionHandler>({
        method: ExtensionRequest.BRIDGE_TRANSACTION_REMOVE,
        params: [txHash],
      });
    },
    [request],
  );

  return useMutation({
    mutationFn: async () => {
      for (const transfer of finalizedTransfers) {
        await untrackTransaction(transfer.sourceTxHash);
      }
    },
  });
}
