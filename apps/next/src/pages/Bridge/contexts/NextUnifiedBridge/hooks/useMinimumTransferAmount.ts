import { BridgeAsset, UnifiedBridgeService } from '@avalabs/bridge-unified';
import { assert } from '@core/common';
import { CommonError, NetworkWithCaipId } from '@core/types';
import { useNetworkContext } from '@core/ui';
import { useCallback } from 'react';
import { buildChain } from '../utils';

export function useMinimumTransferAmount(core: UnifiedBridgeService | null) {
  const { getNetwork } = useNetworkContext();

  const getMinimumTransferAmount = useCallback(
    async (
      asset: BridgeAsset,
      amount: bigint,
      sourceNetworkId: NetworkWithCaipId['caipId'],
      targetChainId: string,
    ) => {
      const sourceNetwork = getNetwork(sourceNetworkId);
      assert(core, CommonError.Unknown);

      return core.getMinimumTransferAmount({
        asset,
        amount,
        sourceChain: buildChain(sourceNetwork),
        targetChain: buildChain(getNetwork(targetChainId)),
      });
    },
    [core, getNetwork],
  );

  return getMinimumTransferAmount;
}
