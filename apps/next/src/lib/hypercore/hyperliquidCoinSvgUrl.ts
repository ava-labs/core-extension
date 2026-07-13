export const HYPERLIQUID_COIN_SVG_BASE = 'https://app.hyperliquid.xyz/coins';

export const hyperliquidCoinSvgKey = (coin: string) => {
  const trimmed = coin.trim();
  const separatorIndex = trimmed.indexOf(':');
  if (separatorIndex === -1) {
    return trimmed.toUpperCase();
  }
  // HIP-3 logos are keyed as `marketname:TICKER` (dex prefix is case-significant).
  return `${trimmed.slice(0, separatorIndex)}:${trimmed.slice(separatorIndex + 1).toUpperCase()}`;
};

export const hyperliquidCoinSvgUrl = (coin: string) =>
  `${HYPERLIQUID_COIN_SVG_BASE}/${encodeURIComponent(hyperliquidCoinSvgKey(coin))}.svg`;
