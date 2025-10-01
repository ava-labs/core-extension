import { UnifiedBridgeService } from '@avalabs/bridge-unified';
import { assert, lowerCaseKeys } from '@core/common';
import {
  CommonError,
  NetworkWithCaipId,
  UnifiedBridgeError,
} from '@core/types';
import { useNetworkContext } from '@core/ui';
import { useCallback } from 'react';
import { buildChain, getAsset } from '../utils';

export function useFee(
  core: UnifiedBridgeService | null,
  sourceNetwork: NetworkWithCaipId | undefined,
) {
  const { getNetwork } = useNetworkContext();
  const getFee = useCallback(
    async (
      symbol: string,
      amount: bigint,
      targetChainId: string,
    ): Promise<bigint> => {
      assert(core, CommonError.Unknown);
      assert(sourceNetwork, CommonError.NoActiveNetwork);

      const asset = getAsset(core, symbol, sourceNetwork.caipId);
      assert(asset, UnifiedBridgeError.UnknownAsset);

      const feeMap = lowerCaseKeys(
        await core.getFees({
          asset,
          amount,
          targetChain: buildChain(getNetwork(targetChainId)),
          sourceChain: buildChain(sourceNetwork),
        }),
      );

      // We currently operate on the assumption that the fee is paid in the
      // same token as is bridged.
      // Although sometimes it may be paid on the source chain (as is the case for CCTP),
      // and sometimes it may be paid on the target chain (i.e. Avalanche Bridge), the
      // result for the end users is that the received amount on the target chain is lowered
      // by the fee amount.
      const [feeChainId] = Object.keys(feeMap); // ID of the chain where the fee is paid
      assert(feeChainId, UnifiedBridgeError.InvalidFee);
      const feeChain = feeMap[feeChainId];
      assert(feeChain, UnifiedBridgeError.InvalidFee);
      const [feeAssetId] = Object.keys(feeChain); // address or "NATIVE"
      assert(feeAssetId, UnifiedBridgeError.InvalidFee);

      return feeChain[feeAssetId] ?? 0n;
    },
    [core, sourceNetwork, getNetwork],
  );

  return getFee;
}
