import { getUserFills, getUserNonFundingLedgerUpdates } from '../infoClient';
import type { HypercoreLedgerUpdate } from '../schemas';
import type { HypercoreActivityItem } from './types';
import { toTimeMs } from './types';

/** Bound ledger pagination so busy accounts cannot trigger unbounded requests. */
export const MAX_LEDGER_PAGES = 20;

/** Prefer recent ledger history; paging from `0` would return the oldest pages first. */
export const LEDGER_LOOKBACK_MS = 365 * 24 * 60 * 60 * 1000;

type FetchHypercoreActivityOptions = {
  signal?: AbortSignal;
};

const isAbortError = (err: unknown) =>
  (err instanceof DOMException && err.name === 'AbortError') ||
  (err instanceof Error && err.name === 'AbortError');

const softFail = async <T>(promise: Promise<T>, fallback: T): Promise<T> => {
  try {
    return await promise;
  } catch (err) {
    if (isAbortError(err)) {
      throw err;
    }
    return fallback;
  }
};

/**
 * `userNonFundingLedgerUpdates` returns an ascending, capped page (~500) from
 * `startTime`. Start within a lookback window and page forward until empty,
 * aborted, or `MAX_LEDGER_PAGES`, so recent activity is included without an
 * unbounded crawl from epoch.
 */
const fetchLedgerUpdates = async (
  evmAddress: string,
  options?: FetchHypercoreActivityOptions,
) => {
  const all: HypercoreLedgerUpdate[] = [];
  let startTime = Date.now() - LEDGER_LOOKBACK_MS;
  let pages = 0;

  while (pages < MAX_LEDGER_PAGES) {
    if (options?.signal?.aborted) {
      throw new DOMException('The operation was aborted.', 'AbortError');
    }

    const page = await getUserNonFundingLedgerUpdates(
      evmAddress,
      startTime,
      options,
    );
    pages += 1;
    if (page.length === 0) {
      break;
    }
    all.push(...page);
    const last = page[page.length - 1];
    if (!last) {
      break;
    }
    const next = last.time + 1;
    if (next <= startTime) {
      break;
    }
    startTime = next;
  }

  return all;
};

/**
 * Fetches HyperCore fills + non-funding ledger updates and sorts newest-first.
 * Soft-fails individual endpoints so a flaky fills or ledger call still yields
 * partial history (abort errors are rethrown).
 */
export const fetchHypercoreActivity = async (
  evmAddress: string,
  options?: FetchHypercoreActivityOptions,
): Promise<HypercoreActivityItem[]> => {
  const [fills, ledgerUpdates] = await Promise.all([
    softFail(getUserFills(evmAddress, options), []),
    softFail(fetchLedgerUpdates(evmAddress, options), []),
  ]);

  const items: HypercoreActivityItem[] = [
    ...fills.map((fill) => ({
      kind: 'fill' as const,
      timeMs: toTimeMs(fill.time),
      hash: fill.hash,
      fill,
    })),
    ...ledgerUpdates.map((update) => ({
      kind: 'ledger' as const,
      timeMs: toTimeMs(update.time),
      hash: update.hash,
      update,
    })),
  ];

  return items.sort((a, b) => b.timeMs - a.timeMs);
};
