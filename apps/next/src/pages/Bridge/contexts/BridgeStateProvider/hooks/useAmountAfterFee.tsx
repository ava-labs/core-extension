import { BridgeAsset } from '@avalabs/bridge-unified';
import { stringToBigint } from '@core/common';
import { useEffect, useState } from 'react';
import { useNextUnifiedBridgeContext } from '../../NextUnifiedBridge';

type FeeState = {
  fee: bigint | undefined;
  amountAfterFee: bigint | undefined;
};

const DEFAULT_STATE: FeeState = {
  fee: undefined,
  amountAfterFee: undefined,
};

export function useAmountAfterFee(
  asset: BridgeAsset | undefined,
  balance: bigint | undefined,
  requiredGas: bigint,
  amount: string,
  sourceNetworkId: string,
  targetNetworkId: string | undefined,
) {
  const [feeState, setFeeState] = useState<FeeState>(DEFAULT_STATE);
  const { getFee } = useNextUnifiedBridgeContext();

  useEffect(() => {
    setFeeState(DEFAULT_STATE);

    if (
      !asset ||
      !amount ||
      !targetNetworkId ||
      requiredGas == null ||
      balance == null
    ) {
      return;
    }

    const { symbol, decimals } = asset;
    const amountBigInt = stringToBigint(amount, decimals);

    getFee(symbol, amountBigInt, sourceNetworkId, targetNetworkId).then(
      (fee) => {
        const afterFee = amountBigInt - fee;
        setFeeState({
          fee,
          amountAfterFee: afterFee < 0n ? 0n : afterFee,
        });
      },
    );
  }, [
    asset,
    amount,
    targetNetworkId,
    getFee,
    sourceNetworkId,
    requiredGas,
    balance,
  ]);

  return feeState;
}
