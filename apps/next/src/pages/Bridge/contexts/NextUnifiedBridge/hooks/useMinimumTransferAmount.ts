import { BridgeAsset, UnifiedBridgeService } from '@avalabs/bridge-unified';
import { assert } from '@core/common';
import { CommonError } from '@core/types';
import { useNetworkContext } from '@core/ui';
import { useCallback } from 'react';
import { buildChain } from '../utils';

export function useMinimumTransferAmount(core: UnifiedBridgeService | null) {
  const { getNetwork } = useNetworkContext();

  const getMinimumTransferAmount = useCallback(
    async (
      asset: BridgeAsset,
      amount: bigint,
      sourceNetworkId: string,
      targetNetworkId: string,
    ) => {
      assert(core, CommonError.Unknown);

      return core.getMinimumTransferAmount({
        asset,
        amount,
        sourceChain: buildChain(getNetwork(sourceNetworkId)),
        targetChain: buildChain(getNetwork(targetNetworkId)),
      });
    },
    [core, getNetwork],
  );

  return getMinimumTransferAmount;
}
