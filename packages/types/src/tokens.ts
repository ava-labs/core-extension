export const TOKENS_PRICE_DATA = 'tokens-price-data';
export const TOKENS_PRICE_DATA_VERSION = 2;

export interface PriceChangesData {
  internalId: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  roi: null | {
    times: number;
    currency: string;
    percentage: number;
  };
  platforms: Record<string, string>;
  last_updated: string;
}

type InternalId = string;
export type TokensPriceShortData = Record<
  InternalId,
  {
    internalId: string;
    symbol: string;
    platforms: Record<string, string>;
    priceChange?: number;
    priceChangePercentage?: number;
    currentPrice?: number;
  }
>;
export interface TokensPriceChangeData {
  currency: string;
  lastUpdatedAt: number;
  version?: number;
  priceChanges: TokensPriceShortData;
}

export interface TokenPriceChanges {
  percentage: number | undefined;
  value: number;
  currentPrice: number | undefined;
}

export const priceChangeRefreshRate = 1000 * 60 * 5;
