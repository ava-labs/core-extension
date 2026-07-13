import { z } from 'zod';

const tokenIndexSchema = z
  .union([z.number(), z.string()])
  .transform((token) => (typeof token === 'number' ? token : Number(token)));

/** `type: "spotMeta"` — registry mapping spot token index → display metadata. */
export const spotMetaResponseSchema = z.object({
  tokens: z.array(
    z.object({
      name: z.string(),
      index: z.number(),
      weiDecimals: z.number(),
      fullName: z.string().nullish(),
      evmContract: z.object({ address: z.string() }).nullish(),
    }),
  ),
});

const spotBalanceSchema = z.object({
  coin: z.string(),
  token: tokenIndexSchema,
  total: z.string(),
  hold: z.string(),
  entryNtl: z.string().optional(),
});

/** `type: "spotClearinghouseState"` */
export const spotClearinghouseStateSchema = z.object({
  balances: z.array(spotBalanceSchema),
});

const marginSummarySchema = z.object({
  accountValue: z.string(),
  totalMarginUsed: z.string().optional(),
  totalNtlPos: z.string().optional(),
  totalRawUsd: z.string().optional(),
});

/**
 * `type: "clearinghouseState"` — only fields needed for PnL-excluded
 * perp collateral fold-in.
 */
export const clearinghouseStateSchema = z.object({
  assetPositions: z.array(
    z.object({
      position: z.object({
        unrealizedPnl: z.string(),
      }),
    }),
  ),
  crossMarginSummary: marginSummarySchema,
});

/**
 * `type: "userAbstraction"` — bare JSON string. Unknown future values coerce
 * to `"default"` so balance math stays conservative.
 */
export const userAbstractionSchema = z
  .union([
    z.literal('unifiedAccount'),
    z.literal('portfolioMargin'),
    z.literal('dexAbstraction'),
    z.literal('disabled'),
    z.literal('default'),
    z.string(),
  ])
  .transform((value) => {
    switch (value) {
      case 'unifiedAccount':
      case 'portfolioMargin':
      case 'dexAbstraction':
      case 'disabled':
      case 'default':
        return value;
      default:
        return 'default' as const;
    }
  });

/** `type: "userFills"` */
export const userFillSchema = z.object({
  closedPnl: z.string(),
  coin: z.string(),
  crossed: z.boolean(),
  dir: z.string(),
  hash: z.string(),
  oid: z.number(),
  px: z.string(),
  side: z.string(),
  startPosition: z.string(),
  sz: z.string(),
  time: z.number(),
  fee: z.string().optional(),
  tid: z.number().optional(),
});

export const userFillsSchema = z.array(userFillSchema);

/**
 * `userNonFundingLedgerUpdates` deltas — permissive so unknown delta types
 * still parse and can render generically later.
 */
export const hypercoreLedgerDeltaSchema = z.object({
  type: z.string(),
  usdc: z.string().optional(),
  amount: z.string().optional(),
  usdcValue: z.string().optional(),
  token: z.string().optional(),
  user: z.string().optional(),
  destination: z.string().optional(),
  fee: z.string().optional(),
  toPerp: z.boolean().optional(),
});

export const hypercoreLedgerUpdateSchema = z.object({
  time: z.number(),
  hash: z.string(),
  delta: hypercoreLedgerDeltaSchema,
});

export const hypercoreLedgerUpdatesSchema = z.array(
  hypercoreLedgerUpdateSchema,
);

export type SpotMetaResponse = z.infer<typeof spotMetaResponseSchema>;
export type SpotClearinghouseState = z.infer<
  typeof spotClearinghouseStateSchema
>;
export type ClearinghouseState = z.infer<typeof clearinghouseStateSchema>;
export type UserAbstractionMode = z.infer<typeof userAbstractionSchema>;
export type UserFill = z.infer<typeof userFillSchema>;
export type HypercoreLedgerUpdate = z.infer<typeof hypercoreLedgerUpdateSchema>;
export type SpotBalance = SpotClearinghouseState['balances'][number];
