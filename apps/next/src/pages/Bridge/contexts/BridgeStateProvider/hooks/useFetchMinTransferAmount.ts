import { UnifiedBridgeContext } from '@/pages/Bridge/contexts/NextUnifiedBridge';
import { BridgeAsset } from '@avalabs/bridge-unified';
import { stringToBigint } from '@core/common';
import { useEffect, useState } from 'react';

export function useFetchMinTransferAmount(
  getMinAmountService: UnifiedBridgeContext['getMinimumTransferAmount'],
  asset: BridgeAsset | undefined,
  amount: string | undefined,
  sourceNetworkId: string | undefined,
  targetNetworkId: string | undefined,
) {
  const [minAmount, setMinAmount] = useState<bigint>();

  useEffect(() => {
    if (
      !asset ||
      !amount ||
      !sourceNetworkId ||
      !targetNetworkId ||
      stringToBigint(amount, asset.decimals) <= 0n
    ) {
      setMinAmount(undefined);
      return;
    }
    getMinAmountService(
      asset,
      stringToBigint(amount, asset.decimals),
      sourceNetworkId,
      targetNetworkId,
    ).then(setMinAmount);
  }, [asset, targetNetworkId, amount, sourceNetworkId, getMinAmountService]);

  return minAmount;
}
