import {
  BridgeTransfer,
  GasSettings,
  UnifiedBridgeService,
} from '@avalabs/bridge-unified';
import { assert } from '@core/common';
import { UnifiedBridgeTrackTransfer } from '@core/service-worker';
import {
  CommonError,
  ExtensionRequest,
  NetworkWithCaipId,
  UnifiedBridgeError,
} from '@core/types';
import {
  useAccountsContext,
  useConnectionContext,
  useNetworkContext,
} from '@core/ui';
import { useCallback } from 'react';
import { buildParams, getChainAssetBySymbol } from '../utils';

export function useTransferAsset(core: UnifiedBridgeService | null) {
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();
  const { getNetwork } = useNetworkContext();
  const { request } = useConnectionContext();

  const trackBridgeTransfer = useCallback(
    async (bridgeTransfer: BridgeTransfer) => {
      return request<UnifiedBridgeTrackTransfer>({
        method: ExtensionRequest.UNIFIED_BRIDGE_TRACK_TRANSFER,
        params: [bridgeTransfer],
      });
    },
    [request],
  );

  const transferAsset = useCallback(
    async (
      symbol: string,
      amount: bigint,
      sourceNetworkId: NetworkWithCaipId['caipId'],
      targetNetworkId: NetworkWithCaipId['caipId'],
      gasSettings?: GasSettings,
    ) => {
      assert(core, CommonError.Unknown);

      const sourceNetwork = getNetwork(sourceNetworkId);
      assert(sourceNetwork, CommonError.NoActiveNetwork);

      const targetNetwork = getNetwork(targetNetworkId);
      assert(targetNetwork, CommonError.UnknownNetwork);

      const asset = getChainAssetBySymbol(core, symbol, sourceNetwork.caipId);
      assert(asset, UnifiedBridgeError.UnknownAsset);

      const { fromAddress, toAddress, sourceChain, targetChain } =
        await buildParams(activeAccount, sourceNetwork, targetNetwork);

      try {
        const bridgeTransfer = await core.transferAsset({
          asset,
          fromAddress,
          toAddress,
          amount,
          sourceChain,
          targetChain,
          gasSettings,
        });

        await trackBridgeTransfer(bridgeTransfer);

        return bridgeTransfer.sourceTxHash;
      } catch (err) {
        console.error(err);
        throw err;
      }
    },
    [core, activeAccount, getNetwork, trackBridgeTransfer],
  );

  return transferAsset;
}
