import { UnifiedBridgeService } from '@avalabs/bridge-unified';
import { assert } from '@core/common';
import {
  CommonError,
  NetworkWithCaipId,
  UnifiedBridgeError,
} from '@core/types';
import { useAccountsContext, useNetworkContext } from '@core/ui';
import { useCallback } from 'react';
import { buildParams, getAsset } from '../utils';

export function useEstimateTransferGas(
  core: UnifiedBridgeService | null,
  sourceNetwork: NetworkWithCaipId | undefined,
) {
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();
  const { getNetwork } = useNetworkContext();

  const estimateTransferGas = useCallback(
    async (
      symbol: string,
      amount: bigint,
      targetChainId: string,
    ): Promise<bigint> => {
      assert(core, CommonError.Unknown);
      assert(sourceNetwork, CommonError.NoActiveNetwork);

      const asset = getAsset(core, symbol, sourceNetwork.caipId);

      assert(asset, UnifiedBridgeError.UnknownAsset);

      const { fromAddress, sourceChain, targetChain } = await buildParams(
        activeAccount,
        sourceNetwork,
        getNetwork(targetChainId),
      );

      const gasLimit = await core.estimateGas({
        asset,
        fromAddress,
        amount,
        sourceChain,
        targetChain,
      });

      return gasLimit;
    },
    [core, sourceNetwork, activeAccount, getNetwork],
  );

  return estimateTransferGas;
}
