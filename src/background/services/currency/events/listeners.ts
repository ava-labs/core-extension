import type { ExtensionConnectionEvent } from '@src/background/connections/models';
import type { CurrencyExchangeRatesState } from '../models';
import { CurrencyServiceEvents } from '../models';

export function currencyRatesUpdatedEventListener(
  evt: ExtensionConnectionEvent<CurrencyExchangeRatesState['rates']>,
) {
  return evt.name === CurrencyServiceEvents.RatesUpdated;
}
