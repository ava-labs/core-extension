import { CURRENCIES } from '@core/types';
import { Currency } from './types';

export const MIN_PASSWORD_LENGTH = 8;

// TODO: once the feature flag is removed this can be turned back into a simple array
export const getCurrencies = (
  isBalanceServiceIntegrationOn: boolean,
): Currency[] =>
  [
    {
      symbol: CURRENCIES.USD,
      label: 'United States Dollar',
      countryCode: 'us',
    },
    {
      symbol: CURRENCIES.EUR,
      label: 'Euro',
      countryCode: 'eu',
    },
    {
      symbol: CURRENCIES.GBP,
      label: 'Pound Sterling',
      countryCode: 'gb',
    },
    {
      symbol: CURRENCIES.AUD,
      label: 'Australian Dollar',
      countryCode: 'au',
    },
    {
      symbol: CURRENCIES.CAD,
      label: 'Canadian Dollar',
      countryCode: 'ca',
    },
    {
      symbol: CURRENCIES.CHF,
      label: 'Swiss Franc',
      countryCode: 'ch',
    },
    {
      symbol: CURRENCIES.HKD,
      label: 'Hong Kong Dollar',
      countryCode: 'hk',
    },
    ...(isBalanceServiceIntegrationOn
      ? [
          {
            symbol: CURRENCIES.CLP,
            label: 'Chilean Peso',
            countryCode: 'cl',
          },
          {
            symbol: CURRENCIES.CZK,
            label: 'Czech Crown',
            countryCode: 'cz',
          },
          {
            symbol: CURRENCIES.DKK,
            label: 'Danish Krone',
            countryCode: 'dk',
          },
          {
            symbol: CURRENCIES.HUF,
            label: 'Hungarian Forint',
            countryCode: 'hu',
          },
        ]
      : []),
  ].flat();
