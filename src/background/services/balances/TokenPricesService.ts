import { singleton } from 'tsyringe';
import { SimplePriceInCurrency } from '@avalabs/coingecko-sdk';
import { SettingsService } from '../settings/SettingsService';
import { getTokensPrice } from '@avalabs/token-prices-sdk';
import { simplePrice, getBasicCoingeckoHttp } from '@avalabs/coingecko-sdk';
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
    const coinPriceResult = await simplePrice(getBasicCoingeckoHttp(), {
      coinIds: [coinId],
      currencies: [currencyCode],
    });
    return coinPriceResult[coinId]?.[currencyCode]?.price;
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
    const avaxPrice = await this.getPriceByCoinId(coinId, selectedCurrency);
    const tokenPriceRes = await getTokensPrice(
      [address],
      selectedCurrency.toLowerCase(),
      avaxPrice || 0,
      assetPlatformId
    );

    return tokenPriceRes[address][selectedCurrency.toLowerCase()];
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
    const avaxPrice = await this.getPriceByCoinId(coinId, selectedCurrency);
    const tokenAddys = tokens.map((token) => token.address);
    const currency = selectedCurrency.toLocaleLowerCase();
    return await getTokensPrice(
      tokenAddys,
      currency,
      avaxPrice || 0,
      assetPlatformId
    );
  }
}
