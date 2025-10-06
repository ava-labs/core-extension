import { useEffect, useState } from 'react';
import { useNextUnifiedBridgeContext } from '../../NextUnifiedBridge';

export function useFee(
  targetToken: string,
  amount: string,
  targetNetwork: string | undefined,
) {
  const { getFee } = useNextUnifiedBridgeContext();
  const [fee, setFee] = useState<bigint>(0n);

  useEffect(() => {
    if (targetToken && amount && targetNetwork) {
      getFee(targetToken, BigInt(amount), targetNetwork).then(setFee);
    }
  }, [targetToken, amount, targetNetwork, getFee]);

  return fee;
}
