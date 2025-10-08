import { TokensPriceShortData, TokenPriceChanges } from '@core/types';

export function getPriceChangeValues(
  tokenSymbol: string,
  balanceInCurrency?: number,
  priceChanges?: TokensPriceShortData,
): TokenPriceChanges {
  if (!priceChanges) {
    return {
      percentage: undefined,
      value: 0,
      currentPrice: undefined,
    };
  }
  const symbol = tokenSymbol.toLowerCase();
  const tokenChangePercentage = priceChanges[symbol]?.priceChangePercentage;
  const tokenChangeValue =
    (balanceInCurrency || 0) *
    ((priceChanges[symbol]?.priceChangePercentage || 0) / 100);

  return {
    percentage: tokenChangePercentage,
    value: tokenChangeValue,
    currentPrice: priceChanges[symbol]?.currentPrice,
  };
}
