import { getUserFills, getUserNonFundingLedgerUpdates } from '../infoClient';
import type { HypercoreLedgerUpdate } from '../schemas';
import type { HypercoreActivityItem } from './types';
import { toTimeMs } from './types';

const fetchLedgerUpdates = async (evmAddress: string) => {
  const all: HypercoreLedgerUpdate[] = [];
  let startTime = 0;

  for (;;) {
    const page = await getUserNonFundingLedgerUpdates(evmAddress, startTime);
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
 */
export const fetchHypercoreActivity = async (
  evmAddress: string,
): Promise<HypercoreActivityItem[]> => {
  const [fills, ledgerUpdates] = await Promise.all([
    getUserFills(evmAddress),
    fetchLedgerUpdates(evmAddress),
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
