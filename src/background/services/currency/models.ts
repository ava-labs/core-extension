export type CurrencyExchangeRates = Record<string, Record<string, number>>;

export type CurrencyExchangeRatesState = {
  date: string;
  rates: CurrencyExchangeRates;
};

export enum CurrencyServiceEvents {
  RatesUpdated = 'CurrencyService::RatesUpdated',
}

// We're only loading exchange rates for USD at the moment.
export const CURRENCY_EXCHANGE_RATES_URL =
  'https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/usd.min.json';

// We refresh data every one hour.
// No need to do it more often, since the above API updates the exchange rates daily.
export const CURRENCY_EXCHANGE_RATES_REFRESH_INTERVAL = 1000 * 60 * 60;

export const CURRENCY_EXCHANGE_RATES_STORAGE_KEY = 'currency-exchange-rates';
