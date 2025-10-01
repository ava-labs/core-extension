import { BridgeAsset, UnifiedBridgeService } from '@avalabs/bridge-unified';
import { assert } from '@core/common';
import { CommonError, NetworkWithCaipId } from '@core/types';
import { useNetworkContext } from '@core/ui';
import { useCallback } from 'react';
import { buildChain } from '../utils';

export function useMinimumTransferAmount(
  core: UnifiedBridgeService | null,
  sourceNetwork: NetworkWithCaipId | undefined,
) {
  const { getNetwork } = useNetworkContext();

  const getMinimumTransferAmount = useCallback(
    async (asset: BridgeAsset, amount: bigint, targetChainId: string) => {
      assert(core, CommonError.Unknown);
      assert(sourceNetwork, CommonError.NoActiveNetwork);

      return core.getMinimumTransferAmount({
        asset,
        amount,
        sourceChain: buildChain(sourceNetwork),
        targetChain: buildChain(getNetwork(targetChainId)),
      });
    },
    [core, sourceNetwork, getNetwork],
  );

  return getMinimumTransferAmount;
}
