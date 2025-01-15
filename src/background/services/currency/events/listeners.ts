import { ExtensionConnectionEvent } from '@src/background/connections/models';
import { CurrencyServiceEvents, CurrencyExchangeRatesState } from '../models';

export function currencyRatesUpdatedEventListener(
  evt: ExtensionConnectionEvent<CurrencyExchangeRatesState['rates']>,
) {
  return evt.name === CurrencyServiceEvents.RatesUpdated;
}
