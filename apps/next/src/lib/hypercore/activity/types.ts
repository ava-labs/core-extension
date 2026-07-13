import type { HypercoreLedgerUpdate, UserFill } from '../schemas';

export type HypercoreActivityItem =
  | {
      readonly kind: 'fill';
      readonly timeMs: number;
      readonly hash: string;
      readonly fill: UserFill;
    }
  | {
      readonly kind: 'ledger';
      readonly timeMs: number;
      readonly hash: string;
      readonly update: HypercoreLedgerUpdate;
    };

/** Normalize a Unix timestamp to milliseconds. */
export const toTimeMs = (time: number) =>
  time < 10_000_000_000 ? time * 1000 : time;
