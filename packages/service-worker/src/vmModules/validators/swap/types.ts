import { MaxBuyOption } from '@core/types';

/**
 * Represents a token in the balance change data
 */
export interface TokenInfo {
  address?: string;
  decimals: number;
  symbol?: string;
  name?: string;
}

/**
 * Represents an individual balance change item with USD pricing
 */
export interface BalanceChangeItem {
  displayValue: string;
  usdPrice: string;
  rawValue?: string;
}

/**
 * Represents a token's balance change with its associated items
 */
export interface TokenBalanceChange {
  token: TokenInfo;
  items: BalanceChangeItem[];
}

/**
 * Context provided for swap validation containing quote and swap details
 */
export interface SwapValidationContext {
  /** Minimum amount expected to receive (in token's smallest unit) */
  minAmountOut: string;
  /** Source token contract address */
  srcTokenAddress: string;
  /** Destination token contract address */
  destTokenAddress: string;
  /** Whether source token is the native token (e.g., ETH, AVAX) */
  isSrcTokenNative: boolean;
  /** Whether destination token is the native token */
  isDestTokenNative: boolean;
  /** Slippage tolerance as percentage (e.g., 1 = 1%) */
  slippage: number;
  /** Maximum buy limit setting */
  maxBuy?: MaxBuyOption;
  /** Whether swap fees are enabled for this transaction */
  isSwapFeesEnabled?: boolean;
}

/**
 * Balance change data containing incoming and outgoing tokens
 */
export interface BalanceChangeData {
  ins: TokenBalanceChange[];
  outs: TokenBalanceChange[];
}
