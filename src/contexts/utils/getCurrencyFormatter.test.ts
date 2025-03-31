import { getCurrencyFormatter } from './getCurrencyFormatter';

describe('contexts/utils/getCurrencyFormatter', () => {
  const formatter = getCurrencyFormatter();
  it('should return with the dollar sign and the first two fraction numbers when the integer is a zero', () => {
    const value = formatter(0.123);
    expect(value).toBe('$0.123');

    const value2 = formatter(0.02);
    expect(value2).toBe('$0.02');

    const value3 = formatter(0.0234);
    expect(value3).toBe('$0.023');
  });
  it('should return with the dollar sign and look for the last non-zero fraction number', () => {
    const value = formatter(0.23);
    expect(value).toBe('$0.23');

    const value2 = formatter(0.023);
    expect(value2).toBe('$0.023');

    // NOTE: this is the last point (in terms of the number of the fraction part) we handle, below that the scientific notation is not something we deal with at the moment
    const value3 = formatter(0.0023);
    expect(value3).toBe('$0.002');
  });

  it('should transform a small number to `0.001` or a big number to `∞` from scientific notation', () => {
    const value = formatter(0.0000000001);
    expect(value).toBe('<$0.001');

    // eslint-disable-next-line no-loss-of-precision
    const value2 = formatter(999999999999999999999);
    expect(value2).toBe('$∞');
  });
});
