import { BridgeOptions } from '@core/types';
import { handleTxOutcome } from '@core/common';
import { useCallback, useState } from 'react';

export const useBridgeTxHandling = ({
  transfer,
  onInitiated,
  onSuccess,
  onFailure,
  onRejected,
}: {
  transfer: (options: BridgeOptions) => Promise<string>;
  onInitiated: () => void;
  onSuccess: (txHash: string) => void;
  onFailure: (error: unknown) => void;
  onRejected: () => void;
}) => {
  const [isPending, setIsPending] = useState(false);

  const onTransfer = useCallback(
    async (options: BridgeOptions) => {
      setIsPending(true);

      try {
        onInitiated();

        const {
          isApproved,
          hasError,
          result: txHash,
          error: txError,
        } = await handleTxOutcome(transfer(options));

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
