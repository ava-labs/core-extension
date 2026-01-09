import { BridgeTransfer } from '@avalabs/bridge-unified';
import { useEffect, useState } from 'react';

const STORAGE_KEY_PREFIX = 'sourceConfirmationsEndTime_';

/**
 * Caches the timestamp when source confirmations complete.
 *
 * For BTC.b → BTC bridges, there's up to a 6-hour gap between source confirmations
 * completing and the target BTC transaction being created. This hook captures and
 * persists that timestamp to localStorage so the elapsed timer stays accurate
 * across page refreshes.
 *
 * Returns: `targetStartedAt` if set, otherwise the cached timestamp, or undefined.
 */
export function useSourceConfirmationsEndTime(
  bridgeTransaction: BridgeTransfer | undefined,
  isSourceConfirmationsComplete: boolean,
  isComplete: boolean,
): number | undefined {
  const storageKey = bridgeTransaction?.sourceTxHash
    ? `${STORAGE_KEY_PREFIX}${bridgeTransaction.sourceTxHash}`
    : null;

  const [cachedEndTime, setCachedEndTime] = useState<number | undefined>(() => {
    if (!storageKey) return undefined;
    const cached = localStorage.getItem(storageKey);
    return cached ? parseInt(cached, 10) : undefined;
  });

  // Cache timestamp when source confirmations complete (before targetStartedAt is set)
  useEffect(() => {
    if (
      isSourceConfirmationsComplete &&
      !bridgeTransaction?.targetStartedAt &&
      !cachedEndTime &&
      storageKey
    ) {
      const now = Date.now();
      setCachedEndTime(now);
      localStorage.setItem(storageKey, String(now));
    }
  }, [
    isSourceConfirmationsComplete,
    bridgeTransaction?.targetStartedAt,
    cachedEndTime,
    storageKey,
  ]);

  // Clean up on completion
  useEffect(() => {
    if (isComplete && storageKey) {
      localStorage.removeItem(storageKey);
    }
  }, [isComplete, storageKey]);

  return bridgeTransaction?.targetStartedAt || cachedEndTime;
}
