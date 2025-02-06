import type { BridgeTransfer } from '@avalabs/bridge-unified';
import type { BridgeTransaction } from '@avalabs/core-bridge-sdk';
import { isUnifiedBridgeTransfer } from '@src/pages/Bridge/utils/isUnifiedBridgeTransfer';

export const getBridgedAssetSymbol = (
  tx: BridgeTransfer | BridgeTransaction,
): string => {
  if (isUnifiedBridgeTransfer(tx)) {
    return tx.asset.symbol;
  }

  return tx.symbol;
};
