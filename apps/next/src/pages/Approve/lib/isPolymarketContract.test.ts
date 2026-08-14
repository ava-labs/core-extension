import { isPolymarketContract } from './isPolymarketContract';

const POLYMARKET_ONRAMP = '0x93070a847efEf7F70739046A929D47a521F5B8ee';

describe('isPolymarketContract', () => {
  it('returns true for a Polymarket contract on Polygon', () => {
    expect(isPolymarketContract(POLYMARKET_ONRAMP)).toBe(true);
  });

  it('is case-insensitive on the destination address', () => {
    expect(isPolymarketContract(POLYMARKET_ONRAMP.toLowerCase())).toBe(true);
  });

  it('returns false for a non-Polymarket destination on Polygon', () => {
    expect(
      isPolymarketContract('0x1111111111111111111111111111111111111111'),
    ).toBe(false);
  });

  it('returns false when the destination is missing', () => {
    expect(isPolymarketContract('')).toBe(false);
  });
});
