import { ExtensionConnectionEvent } from '../../../connections/models';
import { CurrencyServiceEvents, CurrencyExchangeRatesState } from '@core/types/src/models';

export function currencyRatesUpdatedEventListener(
  evt: ExtensionConnectionEvent<CurrencyExchangeRatesState['rates']>,
) {
  return evt.name === CurrencyServiceEvents.RatesUpdated;
}
