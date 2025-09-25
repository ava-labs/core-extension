const percentageFormatter = new Intl.NumberFormat('en-US', {
  style: 'percent',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const formatBasisPointsToPercentage = (basisPoints: number): string => {
  // E.g. 85 -> 0.85%
  return percentageFormatter.format(basisPoints / 10_000);
};
