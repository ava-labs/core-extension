import type Big from 'big.js';

import { useEthBridge } from '../hooks/useEthBridge';
import { useBridgeTxHandling } from '../hooks/useBridgeTxHandling';

import { BridgeForm, BridgeFormProps } from './BridgeForm';

type BridgeFormETHProps = Omit<
  BridgeFormProps,
  keyof ReturnType<typeof useEthBridge> | 'onTransfer' | 'isPending'
> & {
  amount: Big;
  bridgeFee: Big;
  minimum: Big;

  onInitiated: () => void;
  onSuccess: (txHash: string) => void;
  onFailure: (error: unknown) => void;
  onRejected: () => void;
};

export const BridgeFormETH = ({
  onInitiated,
  onSuccess,
  onFailure,
  onRejected,
  ...props
}: BridgeFormETHProps) => {
  const { amount, bridgeFee, minimum } = props;

  const { transfer, ...bridge } = useEthBridge(amount, bridgeFee, minimum);

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
