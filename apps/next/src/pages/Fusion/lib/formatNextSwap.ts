import type { TFunction } from 'i18next';

// Formats an epoch-ms timestamp into a "July 1, 2026 at 9:00 AM" style string.
// Date and time are formatted with the user's locale, then joined with a
// translated "at" so the connector word localizes correctly.
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
