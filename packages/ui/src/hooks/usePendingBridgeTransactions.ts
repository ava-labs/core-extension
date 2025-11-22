import { useBridgeContext } from '../contexts';
import { useNetworkContext } from '../contexts';
import { useUnifiedBridgeContext } from '../contexts';
import { caipToChainId } from '@core/common';
import { useMemo } from 'react';

export const usePendingBridgeTransactions = () => {
  const { network } = useNetworkContext();
  const { bridgeTransactions: legacyBridgeTransfers } = useBridgeContext();
  const {
    state: { pendingTransfers: unifiedBridgeTransfers },
  } = useUnifiedBridgeContext();

  const bridgeTransactions = useMemo(() => {
    return [
      ...Object.values(legacyBridgeTransfers),
      ...Object.values(unifiedBridgeTransfers).filter(
        (tx) =>
          // filter pending transactions that don't belong to the given network
          network?.chainId === caipToChainId(tx.sourceChain.chainId) ||
          network?.chainId === caipToChainId(tx.targetChain.chainId),
      ),
    ];
  }, [unifiedBridgeTransfers, legacyBridgeTransfers, network]);

  return bridgeTransactions;
};
