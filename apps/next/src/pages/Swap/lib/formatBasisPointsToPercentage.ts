export const formatBasisPointsToPercentage = (basisPoints: number): string => {
  // E.g. 85 -> 0.85%

  // Use Intl.NumberFormat to format the number as a percentage
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(basisPoints / 10_000);
};
