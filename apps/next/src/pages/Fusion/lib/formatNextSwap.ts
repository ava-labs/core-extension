import type { TFunction } from 'i18next';

// `at` is a translation key so the date/time connector localizes correctly.
export const formatNextSwap = (epochMs: number, t: TFunction) => {
  const date = new Date(epochMs);

  const datePart = date.toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const timePart = date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });

  return t('{{date}} at {{time}}', { date: datePart, time: timePart });
};
