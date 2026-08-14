import type { TFunction } from 'i18next';

import type { FrequencyUnit } from '../contexts/RecurringSwapContext';

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

export const MIN_FREQUENCY_INTERVAL_SECONDS = 5 * 60;

export const isFrequencyBelowMinimum = (
  quantity: number,
  unit: FrequencyUnit,
  minSeconds: number = MIN_FREQUENCY_INTERVAL_SECONDS,
) => getFrequencyInSeconds(quantity, unit) < minSeconds;

export const getMinFrequencyMinutes = (
  minSeconds: number = MIN_FREQUENCY_INTERVAL_SECONDS,
) => Math.ceil(minSeconds / 60);

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

// Inline (mid-sentence) variant used by the recurring swap summary. Kept as
// dedicated translation keys instead of `.toLowerCase()`-ing the label —
// case transformations on translated strings aren't reliable across locales.
export const getFrequencyUnitLabelInline = (
  unit: FrequencyUnit,
  quantity: number,
  t: TFunction,
) => {
  const isPlural = quantity !== 1;

  switch (unit) {
    case 'minute':
      return isPlural ? t('minutes') : t('minute');
    case 'hour':
      return isPlural ? t('hours') : t('hour');
    case 'day':
      return isPlural ? t('days') : t('day');
    case 'week':
      return isPlural ? t('weeks') : t('week');
    case 'month':
      return isPlural ? t('months') : t('month');
  }
};
