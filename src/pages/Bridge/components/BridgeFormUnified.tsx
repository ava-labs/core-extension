import type Big from 'big.js';

import { useUnifiedBridge } from '../hooks/useUnifiedBridge';
import { useBridgeTxHandling } from '../hooks/useBridgeTxHandling';

import { BridgeForm, BridgeFormProps } from './BridgeForm';

type BridgeFormUnifiedProps = Omit<
  BridgeFormProps,
  keyof ReturnType<typeof useUnifiedBridge> | 'onTransfer' | 'isPending'
> & {
  amount: Big;
  targetChainId: number;
  currentAssetIdentifier?: string;

  onInitiated: () => void;
  onSuccess: (txHash: string) => void;
  onFailure: (error: unknown) => void;
  onRejected: () => void;
};

export const BridgeFormUnified = ({
  onInitiated,
  onSuccess,
  onFailure,
  onRejected,
  ...props
}: BridgeFormUnifiedProps) => {
  const { amount, targetChainId, currentAssetIdentifier } = props;

  const { transfer, ...bridge } = useUnifiedBridge(
    amount,
    targetChainId,
    currentAssetIdentifier
  );

  const { onTransfer, isPending } = useBridgeTxHandling({
    transfer,
    onInitiated,
    onSuccess,
    onFailure,
    onRejected,
  });

  return (
    <BridgeForm
      {...props}
      {...bridge}
      onTransfer={onTransfer}
      isPending={isPending}
    />
  );
};
