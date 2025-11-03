import { stringToBigint } from '@core/common';
import { FungibleTokenBalance } from '@core/types';
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
  targetToken: FungibleTokenBalance | undefined,
  amount: string,
  sourceNetworkId: string,
  targetNetwork: string | undefined,
) {
  const { getFee } = useNextUnifiedBridgeContext();
  const [feeState, setFeeState] = useState<FeeState>(DEFAULT_STATE);

  const { symbol, decimals } = targetToken ?? {};

  useEffect(() => {
    if (symbol && amount && targetNetwork && decimals) {
      const amountBigInt = stringToBigint(amount, decimals);
      setFeeState(DEFAULT_STATE);
      getFee(symbol, amountBigInt, sourceNetworkId, targetNetwork).then(
        (fee) => {
          const afterFee = amountBigInt - fee;
          setFeeState({
            fee,
            amountAfterFee: afterFee < 0n ? 0n : afterFee,
          });
        },
      );
    }
  }, [amount, targetNetwork, symbol, decimals, getFee, sourceNetworkId]);

  return feeState;
}
