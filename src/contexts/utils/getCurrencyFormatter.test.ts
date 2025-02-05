import { getCurrencyFormatter } from './getCurrencyFormatter';

describe('contexts/utils/getCurrencyFormatter', () => {
  const formatter = getCurrencyFormatter();
  it('should return with the dollar sign and two fraction numbers', () => {
    const value = formatter(12);
    expect(value).toBe('$12.00');

    const value2 = formatter(12.1);
    expect(value2).toBe('$12.10');

    const value3 = formatter(12.01);
    expect(value3).toBe('$12.01');

    const value4 = formatter(12.011);
    expect(value4).toBe('$12.01');
  });
  it('should return with the dollar sign and the first two fraction numbers when the integer is a zero', () => {
    const value = formatter(0.123);
    expect(value).toBe('$0.12');

    const value2 = formatter(0.02);
    expect(value2).toBe('$0.02');

    const value3 = formatter(0.0234);
    expect(value3).toBe('$0.02');
  });
  it('should return with the dollar sign and look for the first non-zero fraction number', () => {
    const value = formatter(0.00023);
    expect(value).toBe('$0.0002');

    const value2 = formatter(0.000023);
    expect(value2).toBe('$0.00002');

    // NOTE: this is the last point (in terms of the number of the fraction part) we handle, below that the scientific notation is not something we deal with at the moment
    const value3 = formatter(0.0000023);
    expect(value3).toBe('$0.000002');

    // this is with scientific notation
    const value4 = formatter(0.00000023);
    expect(value4).not.toBe('$0.0000002');
  });
});
