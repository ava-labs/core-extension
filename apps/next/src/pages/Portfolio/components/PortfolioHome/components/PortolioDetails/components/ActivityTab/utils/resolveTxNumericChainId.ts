import type { TxHistoryItem } from '@core/types';
import { caipToChainId } from '@core/common';

/**
 * Best-effort numeric chain id for activity rows (Glacier / VM modules use CAIP
 * strings like eip155:8453; some paths use plain numbers).
 */
export function resolveTxNumericChainId(
  chainId: TxHistoryItem['chainId'],
): number | undefined {
  if (chainId == null) {
    return undefined;
  }
  if (typeof chainId === 'number') {
    return Number.isNaN(chainId) ? undefined : chainId;
  }
  if (typeof chainId === 'string') {
    if (/^\d+$/.test(chainId)) {
      const parsed = Number(chainId);
      return Number.isNaN(parsed) ? undefined : parsed;
    }
    try {
      return caipToChainId(chainId);
    } catch {
      return undefined;
    }
  }
  return undefined;
}
