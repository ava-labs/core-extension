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
 * Balance change data containing incoming and outgoing tokens
 */
export interface BalanceChangeData {
  ins: TokenBalanceChange[];
  outs: TokenBalanceChange[];
}
