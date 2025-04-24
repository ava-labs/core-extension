import { ExtensionRequest } from '@core/types/src/models';
import { CurrencyExchangeRatesState } from '@core/types/src/models';
import { CurrencyService } from '../CurrencyService';
import { GetCurrencyExchangeRatesHandler } from './getCurrencyExchangeRates';
import { buildRpcCall } from '@src/tests/test-utils';

describe('src/background/services/currency/handlers/getCurrencyExchangeRates.ts', () => {
  const currencyService = (state?: CurrencyExchangeRatesState) =>
    ({ state }) as unknown as CurrencyService;

  describe('when exchange rates are known', () => {
    const service = currencyService({
      date: '2023-06-30',
      rates: {
        usd: {
          eur: 0.9,
          gbp: 1.2,
          pln: 4.08,
        },
      },
    });

    it(`returns an object containing exchange rates`, async () => {
      const handler = new GetCurrencyExchangeRatesHandler(service);

      const response = await handler.handle(
        buildRpcCall({
          id: '1',
          method: ExtensionRequest.CURRENCIES_GET_EXCHANGE_RATES,
        }),
      );

      expect(response).toEqual({
        id: '1',
        method: ExtensionRequest.CURRENCIES_GET_EXCHANGE_RATES,
        result: {
          usd: {
            eur: 0.9,
            gbp: 1.2,
            pln: 4.08,
          },
        },
      });
    });
  });

  describe('when exchange rates are not known', () => {
    const service = currencyService();

    it(`returns an empty object`, async () => {
      const handler = new GetCurrencyExchangeRatesHandler(service);

      const response = await handler.handle(
        buildRpcCall({
          id: '1',
          method: ExtensionRequest.CURRENCIES_GET_EXCHANGE_RATES,
        }),
      );

      expect(response).toEqual({
        id: '1',
        method: ExtensionRequest.CURRENCIES_GET_EXCHANGE_RATES,
        result: {},
      });
    });
  });
});
