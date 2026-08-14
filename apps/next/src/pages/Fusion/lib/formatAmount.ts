// Locale-aware amount formatter used for the recurring swap summary.
// Shows at least 2 decimal places and at most 6 (enough for crypto precision
// without overwhelming the UI).
export const formatAmount = (value: number) => {
  if (!Number.isFinite(value)) {
    return '0.00';
  }
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  });
};
