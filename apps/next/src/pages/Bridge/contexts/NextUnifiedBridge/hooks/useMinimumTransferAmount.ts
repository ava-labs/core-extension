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
      const sourceNetwork = getNetwork(sourceNetworkId);
      const targetNetwork = getNetwork(targetNetworkId);
      assert(core, CommonError.Unknown);
      assert(sourceNetwork, CommonError.UnknownNetwork);
      assert(targetNetwork, CommonError.UnknownNetwork);

      return core.getMinimumTransferAmount({
        asset,
        amount,
        sourceChain: buildChain(sourceNetwork),
        targetChain: buildChain(targetNetwork),
      });
    },
    [core, getNetwork],
  );

  return getMinimumTransferAmount;
}
