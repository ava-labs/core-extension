import { z } from 'zod';

const trendingTokenSchema = z.object({
  internalId: z.string(),
  isNative: z.boolean(),
  address: z.string(),
  decimals: z.number(),
  platforms: z.record(z.string(), z.string()),
  scanResult: z.string().nullable(),
  scannedAt: z.string().nullable(),
  liquidity: z.number(),
  logoURI: z.string().nullable(),
  name: z.string(),
  symbol: z.string(),
  volume24hUSD: z.number(),
  volume24hChangePercent: z.number().nullable(),
  fdv: z.number().nullable(),
  marketcap: z.number().nullable(),
  rank: z.number(),
  price: z.number(),
  price24hChangePercent: z.number().nullable(),
  coingeckoId: z.string().nullable(),
  website: z.string().nullable(),
  sparkline: z.array(
    z.object({
      unixTime: z.number(),
      value: z.number(),
    }),
  ),
});

export const trendingTokensSchema = z.array(trendingTokenSchema);

export type TrendingToken = z.infer<typeof trendingTokenSchema>;

export type TrendingTokensNetwork = 'avalanche' | 'solana';
