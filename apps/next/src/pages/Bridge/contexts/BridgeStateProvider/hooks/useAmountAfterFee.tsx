import { stringToBigint } from '@core/common';
import { FungibleTokenBalance } from '@core/types';
import { useEffect, useState } from 'react';
import { useNextUnifiedBridgeContext } from '../../NextUnifiedBridge';

type FeeState = {
  fee: bigint;
  amountAfterFee: bigint;
};

const DEFAULT_STATE: FeeState = {
  fee: 0n,
  amountAfterFee: 0n,
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
      getFee(symbol, amountBigInt, sourceNetworkId, targetNetwork).then(
        (fee) => {
          setFeeState({
            fee,
            amountAfterFee: amountBigInt - fee,
          });
        },
      );
    }
  }, [amount, targetNetwork, symbol, decimals, getFee, sourceNetworkId]);

  return feeState;
}
