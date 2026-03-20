import {
  TokenType,
  TransactionType,
  type Transaction,
  type TxToken,
} from '@avalabs/vm-module-types';

export const ACTIVITY_MIN_USD_VALUE = 0.01;
export const MIN_FILTERED_RESULTS = 15;
export const MAX_FETCH_PAGES = 5;

// C-Chain per-token quantity thresholds for tokens without reliable USD prices.
// Keyed by lowercase contract address; 'native' for the chain's native token.
// Source: CP-13753 attachment (token_thresholds.json)
export const TOKEN_QUANTITY_THRESHOLDS: Record<string, number> = {
  native: 0.001, // AVAX
  '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7': 0.001, // WAVAX
  '0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e': 0.01, // USDC
  '0x00000000efe302beaa2b3e6e1b18d08d69a9012a': 0.01, // AUSD
  '0x9702230a8ea53601f5cd2dc00fdbc13d4df4a8c7': 0.01, // USDT
  '0xc891eb4cbdeff6e073e859e987815ed1505c2acd': 0.01, // EURC
  '0x8835a2f66a7aaccb297cb985831a616b75e2e16c': 0.01, // EUROP
  '0xfe6b19286885a4f7f55adad09c3cd1f906d2478f': 0.35, // SOL (Wormhole)
  '0x49d5c2bdffac6ce2bfdb6640f4f80f226bc10bab': 0.000005, // WETH.e
  '0x152b9d0fdc40c096757f570a51e494bd4b943e50': 0.000000014, // BTC.b
};

const NFT_TOKEN_TYPES = new Set<TokenType>([
  TokenType.ERC721,
  TokenType.ERC1155,
]);

export type TokenPriceMap = Map<string, number | null>;

function getTokenAddress(token: TxToken): string | undefined {
  if ('address' in token) {
    return token.address;
  }
  return undefined;
}

export function isSpamTransaction(
  transaction: Transaction,
  prices: TokenPriceMap,
): boolean {
  const token = transaction.tokens[0];

  if (!token) {
    return false;
  }

  if (NFT_TOKEN_TYPES.has(token.type)) {
    return false;
  }

  if (transaction.txType === TransactionType.APPROVE) {
    return false;
  }

  const amount = Math.abs(Number(token.amount) || 0);

  const priceKey =
    token.type === TokenType.NATIVE
      ? `NATIVE-${token.symbol.toLowerCase()}`
      : getTokenAddress(token)?.toLowerCase();

  if (priceKey) {
    const price = prices.get(priceKey);

    if (price != null && price > 0) {
      return price * amount < ACTIVITY_MIN_USD_VALUE;
    }
  }

  const thresholdKey =
    token.type === TokenType.NATIVE
      ? 'native'
      : getTokenAddress(token)?.toLowerCase();

  if (thresholdKey) {
    const threshold = TOKEN_QUANTITY_THRESHOLDS[thresholdKey];

    if (threshold !== undefined) {
      return amount < threshold;
    }
  }

  return false;
}

export function filterSpamTransactions(
  transactions: Transaction[],
  prices: TokenPriceMap,
): Transaction[] {
  return transactions.filter((tx) => !isSpamTransaction(tx, prices));
}
