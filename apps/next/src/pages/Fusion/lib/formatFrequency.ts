import type { TFunction } from 'i18next';

import type { FrequencyUnit } from '../contexts/RecurringSwapContext';

// Canonical ordering of FrequencyUnits — used to render the unit dropdown.
export const FREQUENCY_UNITS: FrequencyUnit[] = [
  'minute',
  'hour',
  'day',
  'week',
  'month',
];

// Markr's `/info/chains` endpoint expresses the minimum allowed interval in
// seconds, so we keep the canonical conversion in seconds too.
const SECONDS_IN_UNIT: Record<FrequencyUnit, number> = {
  minute: 60,
  hour: 60 * 60,
  day: 60 * 60 * 24,
  week: 60 * 60 * 24 * 7,
  month: 60 * 60 * 24 * 30,
};

export const getFrequencyInSeconds = (
  quantity: number,
  unit: FrequencyUnit,
) => {
  return quantity * SECONDS_IN_UNIT[unit];
};

export const getFrequencyUnitLabel = (
  unit: FrequencyUnit,
  quantity: number,
  t: TFunction,
) => {
  const isPlural = quantity !== 1;

  switch (unit) {
    case 'minute':
      return isPlural ? t('Minutes') : t('Minute');
    case 'hour':
      return isPlural ? t('Hours') : t('Hour');
    case 'day':
      return isPlural ? t('Days') : t('Day');
    case 'week':
      return isPlural ? t('Weeks') : t('Week');
    case 'month':
      return isPlural ? t('Months') : t('Month');
  }
};
