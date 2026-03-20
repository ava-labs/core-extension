import { NetworkWithCaipId, TokensPriceShortData } from '@core/types';
import {
  TokenType,
  TransactionType,
  type Transaction,
  type TxToken,
} from '@avalabs/vm-module-types';

export const ACTIVITY_MIN_USD_VALUE = 0.01;
export const MIN_FILTERED_RESULTS = 15;
export const MAX_FETCH_PAGES = 5;

type AvaxTokenThresholdRow = {
  ticker: string;
  quantity: number;
  contract_address: string | null;
  note?: string;
};

const AVAX_C_CHAIN_TOKEN_QUANTITY_ROWS: readonly AvaxTokenThresholdRow[] = [
  { ticker: 'AVAX', quantity: 0.001, contract_address: null },
  {
    ticker: 'WAVAX',
    quantity: 0.001,
    contract_address: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7',
  },
  {
    ticker: 'USDC',
    quantity: 0.01,
    contract_address: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E',
  },
  {
    ticker: 'AUSD',
    quantity: 0.01,
    contract_address: '0x00000000eFE302BEAA2b3e6e1b18d08D69a9012a',
  },
  {
    ticker: 'USDT',
    quantity: 0.01,
    contract_address: '0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7',
  },
  {
    ticker: 'EURC',
    quantity: 0.01,
    contract_address: '0xC891EB4cbdEFf6e073e859e987815Ed1505c2ACD',
  },
  {
    ticker: 'EUROP',
    quantity: 0.01,
    contract_address: '0x8835A2F66A7AaCCB297Cb985831A616B75e2E16c',
  },
  {
    ticker: 'SOL',
    quantity: 0.00011,
    contract_address: '0xFE6B19286885a4F7F55AdAD09C3Cd1f906D2478F',
    note: 'Wormhole-bridged Wrapped SOL on Avalanche C-Chain.',
  },
  {
    ticker: 'WETH.e',
    quantity: 0.000005,
    contract_address: '0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB',
  },
  {
    ticker: 'BTC.b',
    quantity: 0.000000014,
    contract_address: '0x152b9d0FdC40C096757F570A51E494bd4b943E50',
  },
];

function buildTokenQuantityThresholds(
  rows: readonly AvaxTokenThresholdRow[],
): Record<string, number> {
  const thresholds: Record<string, number> = {};

  for (const row of rows) {
    if (row.contract_address === null) {
      thresholds.native = row.quantity;
    } else {
      thresholds[row.contract_address.toLowerCase()] = row.quantity;
    }
  }

  return thresholds;
}

// C-Chain per-token quantity thresholds when USD price is unavailable (spam filter fallback).
// Keys: lowercase contract address, or `native` for AVAX.
export const TOKEN_QUANTITY_THRESHOLDS = buildTokenQuantityThresholds(
  AVAX_C_CHAIN_TOKEN_QUANTITY_ROWS,
);

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

function isTokenDustBelowThreshold(
  token: TxToken,
  prices: TokenPriceMap,
): boolean {
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

export function buildTokenPriceMapForTransactions(
  transactions: Transaction[],
  network: NetworkWithCaipId,
  priceData?: TokensPriceShortData,
): TokenPriceMap {
  const prices: TokenPriceMap = new Map();

  if (!priceData) {
    return prices;
  }

  for (const tx of transactions) {
    for (const token of tx.tokens) {
      if (token.type === TokenType.NATIVE) {
        const key = `NATIVE-${token.symbol.toLowerCase()}`;

        if (!prices.has(key)) {
          prices.set(key, priceData[key]?.currentPrice ?? null);
        }
      } else if ('address' in token) {
        const lowered = token.address.toLowerCase();

        if (!prices.has(lowered)) {
          const tokenId = `${network.caipId}-${lowered}`;
          const byId = priceData[tokenId];

          if (byId) {
            prices.set(lowered, byId.currentPrice ?? null);
          } else {
            const byPlatform = Object.values(priceData).find(
              (t) => t.platforms?.[network.caipId] === lowered,
            );
            prices.set(lowered, byPlatform?.currentPrice ?? null);
          }
        }
      }
    }
  }

  return prices;
}

export function buildHistoryTokenUsdPricesRecord(
  transaction: Transaction,
  prices: TokenPriceMap,
): Record<string, number | null> {
  const record: Record<string, number | null> = {};

  for (const token of transaction.tokens) {
    if (token.type === TokenType.NATIVE) {
      const internalKey = `NATIVE-${token.symbol.toLowerCase()}`;
      record[token.symbol] = prices.get(internalKey) ?? null;
      continue;
    }

    const addr = getTokenAddress(token);
    if (addr) {
      const lowered = addr.toLowerCase();
      record[lowered] = prices.get(lowered) ?? null;
    }
  }

  return record;
}

export function isSpamTransaction(
  transaction: Transaction,
  prices: TokenPriceMap,
): boolean {
  const { tokens } = transaction;

  if (tokens.length === 0) {
    return false;
  }

  if (transaction.txType === TransactionType.APPROVE) {
    return false;
  }

  if (tokens.some((t) => NFT_TOKEN_TYPES.has(t.type))) {
    return false;
  }

  return tokens.every((token) => isTokenDustBelowThreshold(token, prices));
}

export function filterSpamTransactions(
  transactions: Transaction[],
  prices: TokenPriceMap,
): Transaction[] {
  return transactions.filter((tx) => !isSpamTransaction(tx, prices));
}
