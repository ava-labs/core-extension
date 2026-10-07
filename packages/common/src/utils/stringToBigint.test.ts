import { safeStringToBigint, stringToBigint } from './stringToBigint';

describe('stringToBigint', () => {
  it('parses a decimal amount', () => {
    expect(stringToBigint('1.5', 2)).toBe(150n);
  });

  // core-utils-sdk groups an amount only when it has a fractional part, so a
  // grouped machine value always carries both separators.
  it('accepts en-US thousands separators', () => {
    expect(stringToBigint('1,000,000.123', 3)).toBe(1000000123n);
    expect(stringToBigint('1,000,000', 0)).toBe(1000000n);
    expect(stringToBigint('1,500.25', 2)).toBe(150025n);
  });

  it('reads a lone comma as the decimal separator', () => {
    expect(stringToBigint('1,5', 2)).toBe(150n);
    expect(stringToBigint('1,50', 2)).toBe(150n);
    expect(stringToBigint('1,500', 3)).toBe(1500n);
    expect(stringToBigint('0,000001', 6)).toBe(1n);
    expect(stringToBigint('1,5678', 4)).toBe(15678n);
  });

  it('reads comma-grouped, dot-decimal amounts', () => {
    expect(stringToBigint('1.234,56', 2)).toBe(123456n);
    expect(stringToBigint('1.000.000', 0)).toBe(1000000n);
  });

  it('keeps a lone dot as the decimal separator', () => {
    expect(stringToBigint('1.234', 3)).toBe(1234n);
  });

  it('rejects values that are not decimal numbers', () => {
    expect(() => stringToBigint('abc', 18)).toThrow(/invalid numeric value/);
    expect(() => stringToBigint('1e21', 0)).toThrow(/invalid numeric value/);
    expect(() => stringToBigint('1,2,3.4.5', 2)).toThrow(
      /invalid numeric value/,
    );
  });

  it('returns 0n from the safe variant when parsing fails', () => {
    expect(safeStringToBigint('abc', 18)).toBe(0n);
    expect(safeStringToBigint('1,000.5', 1)).toBe(10005n);
  });
});
