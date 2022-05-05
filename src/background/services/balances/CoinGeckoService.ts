import { singleton } from 'tsyringe';
import {
  getBasicCoingeckoHttp,
  simplePrice,
  SimplePriceInCurrency,
} from '@avalabs/coingecko-sdk';
import { SettingsService } from '../settings/SettingsService';

@singleton()
export class CoinGeckoService {
  constructor(private settingsService: SettingsService) {}
  async getTokenPrice(coinId: string): Promise<SimplePriceInCurrency> {
    const selectedCurrency = (await this.settingsService.getSettings())
      .currency;
    const tokenPriceRes = await simplePrice(getBasicCoingeckoHttp(), {
      coinIds: [coinId],
      // sdk expects vs currency type but sdk uses strings, they are the same though
      currencies: [selectedCurrency as any],
    });

    return tokenPriceRes[coinId][selectedCurrency.toLowerCase()];
  }
}
