import {
  CurrencyServiceEvents,
  CurrencyExchangeRatesState,
  ExtensionConnectionEvent,
} from '@core/types';

export function currencyRatesUpdatedEventListener(
  evt: ExtensionConnectionEvent,
): evt is ExtensionConnectionEvent<CurrencyExchangeRatesState['rates']> {
  return evt.name === CurrencyServiceEvents.RatesUpdated;
}
