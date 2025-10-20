import { TokenUnit } from '@avalabs/core-utils-sdk';
import { stringToBigint } from '@core/common';
import { FungibleTokenBalance } from '@core/types';
import { useEffect, useMemo, useState } from 'react';
import { useNextUnifiedBridgeContext } from '../../NextUnifiedBridge';

export function useAmountAfterFee(
  targetToken: FungibleTokenBalance | undefined,
  amount: string,
  targetNetwork: string | undefined,
) {
  const { getFee } = useNextUnifiedBridgeContext();
  const [fee, setFee] = useState<bigint>(0n);

  const { symbol, decimals } = targetToken ?? {};

  useEffect(() => {
    if (symbol && amount && targetNetwork && decimals) {
      getFee(symbol, stringToBigint(amount, decimals), targetNetwork).then(
        setFee,
      );
    }
  }, [amount, targetNetwork, symbol, decimals, getFee]);

  const amountAfterFee = useMemo(() => {
    return calculateAmountAfterFee(amount, symbol, decimals, fee);
  }, [amount, symbol, decimals, fee]);

  return { amountAfterFee, fee };
}

function calculateAmountAfterFee(
  amount: string | undefined,
  symbol: string | undefined,
  decimals: number | undefined,
  fee: bigint,
) {
  if (!amount || !symbol || !decimals || !fee) {
    return '';
  }

  const amountBigInt = stringToBigint(amount, decimals);
  const afterFee = new TokenUnit(amountBigInt, decimals, symbol).sub(
    new TokenUnit(fee, decimals, symbol),
  );

  return afterFee.toString();
}
