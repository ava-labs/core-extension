import Big from 'big.js';

import { useBtcBridge } from '../hooks/useBtcBridge';
import { useBridgeTxHandling } from '../hooks/useBridgeTxHandling';

import { BridgeForm, BridgeFormProps } from './BridgeForm';
import { memo } from 'react';

type BridgeFormBTCProps = Omit<
  BridgeFormProps,
  keyof ReturnType<typeof useBtcBridge> | 'onTransfer' | 'isPending'
> & {
  amount: Big;
  bridgeFee: Big;
  minimum: Big;

  onInitiated: () => void;
  onSuccess: (txHash: string) => void;
  onFailure: (error: unknown) => void;
  onRejected: () => void;
};

export const BridgeFormBTC = memo(function BridgeFormBTC({
  onInitiated,
  onSuccess,
  onFailure,
  onRejected,
  ...props
}: BridgeFormBTCProps) {
  const { amount } = props;

  const { transfer, ...bridge } = useBtcBridge(amount);

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
});
