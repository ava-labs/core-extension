import { UnifiedBridgeService } from '@avalabs/bridge-unified';
import { assert } from '@core/common';
import { CommonError, UnifiedBridgeError } from '@core/types';
import { useAccountsContext, useNetworkContext } from '@core/ui';
import { useCallback } from 'react';
import { buildParams, getAsset } from '../utils';

export function useGetTransferGasEstimate(core: UnifiedBridgeService | null) {
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();
  const { getNetwork } = useNetworkContext();

  const estimateTransferGas = useCallback(
    async (
      symbol: string,
      amount: bigint,
      sourceChainId: string,
      targetChainId: string,
    ): Promise<bigint> => {
      const sourceNetwork = getNetwork(sourceChainId);
      const targetNetwork = getNetwork(targetChainId);
      assert(core, CommonError.Unknown);
      assert(sourceNetwork, CommonError.UnknownNetwork);
      assert(targetNetwork, CommonError.UnknownNetwork);

      const asset = getAsset(core, symbol, sourceNetwork.caipId);

      assert(asset, UnifiedBridgeError.UnknownAsset);

      const { fromAddress, sourceChain, targetChain } = await buildParams(
        activeAccount,
        sourceNetwork,
        targetNetwork,
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
    [core, activeAccount, getNetwork],
  );

  return estimateTransferGas;
}
