export const USDC_ADDRESS_C_CHAIN =
  '0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e' as const;

export const USDC_ADDRESS_ETHEREUM =
  '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48' as const;

export const USDC_ADDRESS_SOLANA =
  'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' as const;

export const USDC_ADDRESSES = [
  USDC_ADDRESS_C_CHAIN,
  USDC_ADDRESS_ETHEREUM,
  USDC_ADDRESS_SOLANA,
] as const;

export const AVALANCHE_BLOCKCHAIN_IDS = Object.freeze({
  MAINNET_P: '11111111111111111111111111111111LpoYY',
  TESTNET_P: '11111111111111111111111111111111LpoYY',
  MAINNET_X: '2oYMBNV4eNHyqk2fjjV5nVQLDbtmNJzq5s3qs3Lo6ftnC6FByM',
  TESTNET_X: '2JVSBoinj9C2J33VntvzYtVJNZdN2NKiwwKjcumHUWEb5DbBrm',
  MAINNET_C: '2q9e4r6Mu3U68nU1fYjgbR6JvwrRx36CohpAX5UQxse55x1Q5',
  TESTNET_C: 'yH8D7ThNJkxmtkuv2jgBa4P1Rn3Qpr4pPr7QYNfcdoS6k6HWp',
});

/**
 * Divisor for converting basis points to decimal percentage.
 * @example 100 BPS / 10_000 = 0.01 = 1%
 */
export const BASIS_POINTS_DIVISOR = 10_000 as const;
