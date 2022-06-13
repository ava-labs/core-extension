import { singleton } from 'tsyringe';
import { SimplePriceInCurrency } from '@avalabs/coingecko-sdk';
import { SettingsService } from '../settings/SettingsService';
import { getTokensPrice } from '@avalabs/token-prices-sdk';
import { simplePrice, getBasicCoingeckoHttp } from '@avalabs/coingecko-sdk';
import LRUCache from 'lru-cache';

/**
 * Keeping a cache of responses for ttl. This will allow future calls to utilize
 * previous responses for a given amount of time. Coin gecko rate limits for users that
 * have many accounts and this should help with the rate limiting
 *
 * Side note: A race condition can exist where multiple accounts are asking for the same
 * prices up front. Right now we dont create a cache until the response is returned. However,
 * the cache could hold a promise and this promise would handed to future requests. The issue
 * right now is we dont store into the cache until we recieve a response which could allow several
 *
 *
 */
const tokenPriceResponseCache = new LRUCache({ max: 100, ttl: 60 * 1000 });

@singleton()
export class TokenPricesService {
  constructor(private settingsService: SettingsService) {}
  /**
   * Call this to get the native token price
   * @param coinId the coin id ie avalanche-2 for avax
   * @param selectedCurrency the currency selected
   * @returns the native token price
   */
  async getPriceByCoinId(
    coinId: string,
    selectedCurrency: string
  ): Promise<number | undefined> {
    const currencyCode = selectedCurrency.toLowerCase() as any;
    const cacheKey = `getPriceByCoinId-${coinId}-${selectedCurrency}`;
    const cacheResult = tokenPriceResponseCache.get<number>(cacheKey);
    if (cacheResult) return cacheResult;
    const coinPriceResult = await simplePrice(getBasicCoingeckoHttp(), {
      coinIds: [coinId],
      currencies: [currencyCode],
    });
    const result = coinPriceResult[coinId]?.[currencyCode]?.price;
    tokenPriceResponseCache.set(cacheKey, result);
    return result;
  }

  /**
   *
   * @param address the address of the token needing proce for
   * @param assetPlatformId The platform id for the native token
   * @param coinId the coin id of the native token
   * @returns the price in avax of the token address
   */
  async getTokenPriceByAddress(
    address: string,
    assetPlatformId: string,
    coinId: string
  ): Promise<SimplePriceInCurrency> {
    const selectedCurrency = (await this.settingsService.getSettings())
      .currency;
    const cacheKey = `getTokenPriceByAddress-${coinId}-${selectedCurrency}-${address}`;
    const cacheResult =
      tokenPriceResponseCache.get<SimplePriceInCurrency>(cacheKey);
    if (cacheResult) return cacheResult;
    const avaxPrice = await this.getPriceByCoinId(coinId, selectedCurrency);
    const tokenPriceRes = await getTokensPrice(
      [address],
      selectedCurrency.toLowerCase(),
      avaxPrice || 0,
      assetPlatformId
    );
    const result = tokenPriceRes[address][selectedCurrency.toLowerCase()];
    tokenPriceResponseCache.set(cacheKey, result);
    return result;
  }
  /**
   *
   * @param tokens the tokens with addresses
   * @param assetPlatformId The platform id for the native token
   * @param coinId the coin id of the native token
   * @returns
   */
  async getTokenPricesByAddresses(
    tokens: { address: string }[],
    assetPlatformId: string,
    coinId: string
  ): Promise<Record<string, number>> {
    const selectedCurrency = (await this.settingsService.getSettings())
      .currency;
    const cacheKey = `getTokenPricesByAddresses-${coinId}-${selectedCurrency}-${assetPlatformId}-${tokens.map(
      ({ address }) => address
    )}`;
    const cacheResult =
      tokenPriceResponseCache.get<Record<string, number>>(cacheKey);
    if (cacheResult) return cacheResult;
    const nativeTokenPrice = await this.getPriceByCoinId(
      coinId,
      selectedCurrency
    );
    const tokenAddys = tokens.map((token) => token.address);
    const currency = selectedCurrency.toLocaleLowerCase();
    const result = await getTokensPrice(
      tokenAddys,
      currency,
      nativeTokenPrice || 0,
      assetPlatformId
    );
    tokenPriceResponseCache.set(cacheKey, result);
    return result;
  }
}
