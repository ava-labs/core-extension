import { injectable } from 'tsyringe';

import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';

import { CurrencyExchangeRates } from '../models';
import { CurrencyService } from '../CurrencyService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.CURRENCIES_GET_EXCHANGE_RATES,
  CurrencyExchangeRates
>;

@injectable()
export class GetCurrencyExchangeRatesHandler implements HandlerType {
  method = ExtensionRequest.CURRENCIES_GET_EXCHANGE_RATES as const;

  constructor(private currencyService: CurrencyService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const rates = await this.currencyService.state?.rates;

    try {
      return {
        ...request,
        result: rates ?? {},
      };
    } catch (err: any) {
      return {
        ...request,
        error: err instanceof Error ? err.message : err,
      };
    }
  };
}
