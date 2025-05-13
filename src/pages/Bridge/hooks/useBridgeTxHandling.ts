import { handleTxOutcome } from '@src/utils/handleTxOutcome';
import { useCallback, useState } from 'react';
import { BridgeOptions } from '../models';
import { NetworkWithCaipId } from '@src/background/services/network/models';
import { BridgeAsset } from '@avalabs/bridge-unified';

export const useBridgeTxHandling = ({
  transfer,
  onInitiated,
  onSuccess,
  onFailure,
  onRejected,
}: {
  transfer: (
    options: BridgeOptions,
    newAmount?: bigint,
    newTargetChain?: NetworkWithCaipId,
    newAsset?: BridgeAsset,
  ) => Promise<string>;
  onInitiated: () => void;
  onSuccess: (txHash: string) => void;
  onFailure: (error: unknown) => void;
  onRejected: () => void;
}) => {
  const [isPending, setIsPending] = useState(false);

  const onTransfer = useCallback(
    async (
      options: BridgeOptions,
      newAmount?: bigint,
      newTargetChain?: NetworkWithCaipId,
      newAsset?: BridgeAsset,
    ) => {
      setIsPending(true);

      try {
        onInitiated();

        const {
          isApproved,
          hasError,
          result: txHash,
          error: txError,
        } = await handleTxOutcome(
          transfer(options, newAmount, newTargetChain, newAsset),
        );

        if (isApproved) {
          if (hasError) {
            onFailure(txError);
          } else {
            onSuccess(txHash);
          }
        } else {
          onRejected();
        }
      } finally {
        setIsPending(false);
      }
    },
    [onInitiated, onRejected, onFailure, onSuccess, transfer],
  );

  return { onTransfer, isPending };
};
