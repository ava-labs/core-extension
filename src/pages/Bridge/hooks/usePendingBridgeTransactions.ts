import { useBridgeContext } from '@src/contexts/BridgeProvider';
import { useUnifiedBridgeContext } from '@src/contexts/UnifiedBridgeProvider';
import { useMemo } from 'react';

export const usePendingBridgeTransactions = () => {
  const { bridgeTransactions: legacyBridgeTransfers } = useBridgeContext();
  const {
    state: { pendingTransfers: unifiedBridgeTransfers },
  } = useUnifiedBridgeContext();
  const bridgeTransactions = useMemo(() => {
    return [
      ...Object.values(legacyBridgeTransfers),
      ...Object.values(unifiedBridgeTransfers),
    ];
  }, [unifiedBridgeTransfers, legacyBridgeTransfers]);

  return bridgeTransactions;
};
