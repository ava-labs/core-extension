import {
  HYPERLIQUID_COIN_SVG_BASE,
  hyperliquidCoinSvgKey,
  hyperliquidCoinSvgUrl,
} from './hyperliquidCoinSvgUrl';

describe('hyperliquidCoinSvgUrl', () => {
  it('uppercases simple tickers', () => {
    expect(hyperliquidCoinSvgKey('btc')).toBe('BTC');
    expect(hyperliquidCoinSvgUrl('btc')).toBe(
      `${HYPERLIQUID_COIN_SVG_BASE}/BTC.svg`,
    );
  });

  it('preserves HIP-3 dex prefix casing and uppercases the ticker', () => {
    expect(hyperliquidCoinSvgKey('xyz:brentoil')).toBe('xyz:BRENTOIL');
    expect(hyperliquidCoinSvgUrl('xyz:brentoil')).toBe(
      `${HYPERLIQUID_COIN_SVG_BASE}/${encodeURIComponent('xyz:BRENTOIL')}.svg`,
    );
  });
});
