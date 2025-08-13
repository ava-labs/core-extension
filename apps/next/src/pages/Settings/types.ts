import { CURRENCIES } from '@core/types';

export interface Currency {
  symbol: CURRENCIES;
  label: string;
  countryCode: string;
}
