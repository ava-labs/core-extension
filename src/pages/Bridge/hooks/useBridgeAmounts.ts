import { useMemo } from 'react';
import { BridgeTransaction } from '@avalabs/bridge-sdk';
import { BridgeTransfer } from '@avalabs/bridge-unified';

import { bigintToBig } from '@src/utils/bigintToBig';

import { isUnifiedBridgeTransfer } from '../utils/isUnifiedBridgeTransfer';

export const useBridgeAmounts = (
  bridgeTx?: BridgeTransaction | BridgeTransfer
) => {
  const sourceNetworkFee = useMemo(() => {
    if (typeof bridgeTx?.sourceNetworkFee === 'undefined') {
      return;
    }

    if (isUnifiedBridgeTransfer(bridgeTx)) {
      return bigintToBig(
        bridgeTx.sourceNetworkFee,
        bridgeTx.sourceChain.networkToken.decimals
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
        bridgeTx.targetChain.networkToken.decimals
      );
    }
    return bridgeTx.targetNetworkFee;
  }, [bridgeTx]);

  return {
    amount: isUnifiedBridgeTransfer(bridgeTx)
      ? bigintToBig(bridgeTx.amount, bridgeTx.amountDecimals)
      : bridgeTx?.amount,
    sourceNetworkFee,
    targetNetworkFee,
  };
};
