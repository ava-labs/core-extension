import { BridgeTransfer } from '@avalabs/bridge-unified';
import { BridgeTransaction } from '@avalabs/core-bridge-sdk';
import { useMemo } from 'react';

import { bigintToBig, isUnifiedBridgeTransfer } from '@core/utils';

export const useBridgeAmounts = (
  bridgeTx?: BridgeTransaction | BridgeTransfer,
) => {
  const sourceNetworkFee = useMemo(() => {
    if (typeof bridgeTx?.sourceNetworkFee === 'undefined') {
      return;
    }

    if (isUnifiedBridgeTransfer(bridgeTx)) {
      return bigintToBig(
        bridgeTx.sourceNetworkFee,
        bridgeTx.sourceChain.networkToken.decimals,
      );
    }
    return bridgeTx.sourceNetworkFee;
  }, [bridgeTx]);

  const targetNetworkFee = useMemo(() => {
    if (typeof bridgeTx?.targetNetworkFee === 'undefined') {
      return;
    }

    if (isUnifiedBridgeTransfer(bridgeTx)) {
      return bigintToBig(
        bridgeTx.targetNetworkFee,
        bridgeTx.targetChain.networkToken.decimals,
      );
    }
    return bridgeTx.targetNetworkFee;
  }, [bridgeTx]);

  return {
    amount: isUnifiedBridgeTransfer(bridgeTx)
      ? bigintToBig(bridgeTx.amount, bridgeTx.asset.decimals)
      : bridgeTx?.amount,
    sourceNetworkFee,
    targetNetworkFee,
  };
};
