import { singleton } from 'tsyringe';
import {
  NetworkWithCaipId,
  priceChangeRefreshRate,
  PriceChangesData,
  TOKENS_PRICE_DATA,
  TOKENS_PRICE_DATA_VERSION,
  TokensPriceChangeData,
  TokensPriceShortData,
} from '@core/types';
import { SettingsService } from '../settings/SettingsService';
import { StorageService } from '../storage/StorageService';
import { resolve, watchlistTokens } from '@core/common';

@singleton()
export class TokenPricesService {
  #pendingPriceChangesRequest: Promise<
    TokensPriceShortData | undefined
  > | null = null;

  constructor(
    private settingsService: SettingsService,
    private storageService: StorageService,
  ) {}

  getPriceChangesData = async (): Promise<TokensPriceShortData | undefined> => {
    // If there's already an in-flight request, return that promise to avoid duplicate network calls
    if (this.#pendingPriceChangesRequest) {
      return this.#pendingPriceChangesRequest;
    }

    this.#pendingPriceChangesRequest = this.#fetchPriceChangesData();

    try {
      return await this.#pendingPriceChangesRequest;
    } finally {
      this.#pendingPriceChangesRequest = null;
    }
  };

  #fetchPriceChangesData = async (): Promise<
    TokensPriceShortData | undefined
  > => {
    const selectedCurrency = (await this.settingsService.getSettings())
      .currency;
    const changesData =
      await this.storageService.loadUnencrypted<TokensPriceChangeData>(
        `${TOKENS_PRICE_DATA}-${selectedCurrency}`,
      );

    const lastUpdated = changesData?.lastUpdatedAt;

    let priceChangesData = changesData?.priceChanges || {};

    // Check if cached data has currentPrice field, if not fetch fresh data
    const hasCurrentPrice = Object.values(priceChangesData).some(
      (token: any) =>
        token && typeof token === 'object' && 'currentPrice' in token,
    );

    if (
      !priceChangesData ||
      changesData?.version !== TOKENS_PRICE_DATA_VERSION ||
      !Object.keys(priceChangesData).length ||
      !hasCurrentPrice ||
      (lastUpdated && lastUpdated + priceChangeRefreshRate < Date.now())
    ) {
      const [
        [priceChangesResult, priceChangeResultError],
        [priceResult, priceResultError],
      ] = await Promise.all([
        resolve(
          fetch(
            `${process.env.PROXY_URL}/watchlist/tokens?currency=${selectedCurrency}`,
          ),
        ),
        resolve(fetch(`${process.env.PROXY_URL}/watchlist/price`)),
      ]);

      if ((priceResultError && priceChangeResultError) || !priceChangesResult) {
        return;
      }
      const priceChanges: PriceChangesData[] = await priceChangesResult.json();
      const price = priceResult ? await priceResult.json() : {};
      const tokensData: TokensPriceShortData = priceChanges.reduce(
        (acc: TokensPriceShortData, data: PriceChangesData) => {
          return {
            ...acc,
            [data.internalId]: {
              internalId: data.internalId,
              symbol: data.symbol,
              platforms: data.platforms,
              priceChange: data.price_change_24h,
              priceChangePercentage: data.price_change_percentage_24h,
              currentPrice: watchlistTokens.includes(data.symbol.toLowerCase())
                ? (price[data.symbol] ?? data.current_price)
                : data.current_price,
            },
          };
        },
        {},
      );

      priceChangesData = { ...tokensData };

      this.storageService.saveUnencrypted<TokensPriceChangeData>(
        `${TOKENS_PRICE_DATA}-${selectedCurrency}`,
        {
          version: TOKENS_PRICE_DATA_VERSION,
          priceChanges: tokensData,
          lastUpdatedAt: Date.now(),
          currency: selectedCurrency,
        },
      );
    }
    return priceChangesData;
  };

  /**
   *
   * @param address the address of the token needing proce for
   * @param assetPlatformId The platform id for the native token
   * @param coinId the coin id of the native token
   * @returns the price in avax of the token address
   */
  async getTokenPriceByAddress(
    address: string,
    network: NetworkWithCaipId,
  ): Promise<Record<string, number | null>> {
    const lowercasedAddress = address.toLowerCase();
    const tokenId = `${network.caipId}-${lowercasedAddress}`;

    const tokens = await this.getPriceChangesData();

    if (!tokens) {
      return {
        [address]: null,
      };
    }

    // try to find the token by internalId first
    const priceDataByInternalId = tokens?.[tokenId];

    if (priceDataByInternalId) {
      return {
        [address]: priceDataByInternalId.currentPrice ?? null,
      };
    }

    const priceData = Object.values(tokens).find(
      (token) => token.platforms?.[network.caipId] === lowercasedAddress,
    );

    return {
      [address]: priceData?.currentPrice ?? null,
    };
  }

  /**
   *
   * @param address the address of the token needing proce for
   * @param assetPlatformId The platform id for the native token
   * @param coinId the coin id of the native token
   * @returns the price in avax of the token address
   */
  async getNativeTokenPrice(symbol: string): Promise<number | null> {
    const tokenId = `NATIVE-${symbol.toLowerCase()}`;
    const tokens = await this.getPriceChangesData();
    const priceData = tokens?.[tokenId];

    return priceData?.currentPrice ?? null;
  }
}
