import Big from 'big.js';
import type {
  ClearinghouseState,
  SpotBalance,
  UserAbstractionMode,
} from './schemas';
import type { HypercoreSpotToken } from './spotTokens';

export const HYPERCORE_USDC_SYMBOL = 'USDC';
export const HYPERCORE_USDC_NAME = 'USD Coin';
export const HYPERCORE_USDC_DECIMALS = 8;

const BIG_ZERO = new Big(0);

export type HypercoreNativeTokenBalance = {
  kind: 'native';
  name: string;
  symbol: typeof HYPERCORE_USDC_SYMBOL;
  decimals: number;
  /** Human-readable amount (decimal string). */
  balance: string;
  /** Integer raw amount as a decimal string (no fractional part). */
  balanceRaw: string;
  priceUsd: 1;
  balanceUsd: string;
};

export type HypercoreErc20TokenBalance = {
  kind: 'erc20';
  name: string;
  symbol: string;
  decimals: number;
  balance: string;
  balanceRaw: string;
  address: string;
};

export type HypercoreTokenBalance =
  | HypercoreNativeTokenBalance
  | HypercoreErc20TokenBalance;

/**
 * `true` when spot balances already back perps for this account mode
 * (`unifiedAccount`). Other modes keep perp collateral on a separate ledger.
 */
export const spotCountsAsPerpCollateral = (
  mode: UserAbstractionMode | undefined,
) => mode === 'unifiedAccount';

/** Tokens carry no native gas balance on HyperCore — amounts are human decimals. */
const toRawBalance = (humanAmount: Big, decimals: number) =>
  humanAmount
    .times(new Big(10).pow(decimals))
    .round(0, Big.roundDown)
    .toFixed(0);

const syntheticTokenAddress = (index: number) =>
  `0x${index.toString(16).padStart(40, '0')}`;

/**
 * Perp collateral in USDC, excluding unrealized PnL.
 * `crossMarginSummary.accountValue` is collateral ± PnL; we back PnL out.
 */
export const getPerpCollateralUsd = (perp: ClearinghouseState | undefined) => {
  if (!perp) {
    return BIG_ZERO;
  }

  const accountValue = new Big(perp.crossMarginSummary.accountValue ?? '0');
  const unrealizedPnl = perp.assetPositions.reduce(
    (sum, { position }) => sum.plus(position.unrealizedPnl),
    BIG_ZERO,
  );
  const collateral = accountValue.minus(unrealizedPnl);

  return collateral.gt(BIG_ZERO) ? collateral : BIG_ZERO;
};

/**
 * USDC merges spot + (non-unified) PnL-excluded perp collateral at $1.
 */
export const buildHypercoreTokens = ({
  spotBalances,
  perpState,
  abstractionMode,
  spotTokens,
}: {
  spotBalances: readonly SpotBalance[];
  perpState: ClearinghouseState | undefined;
  abstractionMode: UserAbstractionMode | undefined;
  spotTokens: HypercoreSpotToken[];
}): HypercoreTokenBalance[] => {
  const tokensByIndex = new Map(
    spotTokens.map((token) => [token.index, token]),
  );

  const perpCollateralUsd = spotCountsAsPerpCollateral(abstractionMode)
    ? BIG_ZERO
    : getPerpCollateralUsd(perpState);

  const spotUsdc = spotBalances.find(
    (balance) => balance.coin.toUpperCase() === HYPERCORE_USDC_SYMBOL,
  );
  const usdcTotal = new Big(spotUsdc?.total ?? '0').plus(perpCollateralUsd);

  const tokens: HypercoreTokenBalance[] = [];

  if (usdcTotal.gt(BIG_ZERO)) {
    tokens.push({
      kind: 'native',
      name: HYPERCORE_USDC_NAME,
      symbol: HYPERCORE_USDC_SYMBOL,
      decimals: HYPERCORE_USDC_DECIMALS,
      balance: usdcTotal.toString(),
      balanceRaw: toRawBalance(usdcTotal, HYPERCORE_USDC_DECIMALS),
      priceUsd: 1,
      balanceUsd: usdcTotal.toString(),
    });
  }

  for (const balance of spotBalances) {
    if (balance.coin.toUpperCase() === HYPERCORE_USDC_SYMBOL) {
      continue;
    }

    const meta = tokensByIndex.get(balance.token);
    const total = new Big(balance.total);
    if (!meta || !total.gt(BIG_ZERO)) {
      continue;
    }

    tokens.push({
      kind: 'erc20',
      name: meta.name,
      symbol: meta.symbol,
      decimals: meta.decimals,
      balance: total.toString(),
      balanceRaw: toRawBalance(total, meta.decimals),
      address: meta.address ?? syntheticTokenAddress(meta.index),
    });
  }

  return tokens;
};
