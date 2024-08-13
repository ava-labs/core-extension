import Big from 'big.js';

import { useAvalancheBridge } from '../hooks/useAvalancheBridge';

import { BridgeForm, BridgeFormProps } from './BridgeForm';
import { useBridgeTxHandling } from '../hooks/useBridgeTxHandling';

type BridgeFormAVAXProps = Omit<
  BridgeFormProps,
  keyof ReturnType<typeof useAvalancheBridge> | 'onTransfer' | 'isPending'
> & {
  amount: Big;
  bridgeFee: Big;
  minimum: Big;

  onInitiated: () => void;
  onSuccess: (txHash: string) => void;
  onFailure: (error: unknown) => void;
  onRejected: () => void;
};

export const BridgeFormAVAX = ({
  onInitiated,
  onSuccess,
  onFailure,
  onRejected,
  ...props
}: BridgeFormAVAXProps) => {
  const { amount, bridgeFee, minimum } = props;

  const { transfer, ...bridge } = useAvalancheBridge(
    amount,
    bridgeFee,
    minimum
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
