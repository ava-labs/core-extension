import { expandExponentialNotation } from './expandExponentialNotation';

describe('expandExponentialNotation', () => {
  it('leaves plain decimal strings untouched', () => {
    expect(expandExponentialNotation('0')).toBe('0');
    expect(expandExponentialNotation('1.23456')).toBe('1.23456');
    expect(expandExponentialNotation('-0.0000001')).toBe('-0.0000001');
    expect(expandExponentialNotation('1234567890123456789')).toBe(
      '1234567890123456789',
    );
  });

  it('expands large exponents without losing precision', () => {
    expect(expandExponentialNotation('1.234567e+21')).toBe(
      '1234567000000000000000',
    );
    expect(expandExponentialNotation('1.234567e+28')).toBe(
      '12345670000000000000000000000',
    );
    expect(expandExponentialNotation('1.234567e+21')).not.toBe(
      expandExponentialNotation('1.234567e+28'),
    );
  });

  it('keeps the sign', () => {
    expect(expandExponentialNotation('-1.234567e+21')).toBe(
      '-1234567000000000000000',
    );
    expect(expandExponentialNotation('+1e+3')).toBe('+1000');
  });

  it('expands negative exponents', () => {
    expect(expandExponentialNotation('1.5e-7')).toBe('0.00000015');
    expect(expandExponentialNotation('-1e-9')).toBe('-0.000000001');
  });

  it('handles exponents that land inside the digits', () => {
    expect(expandExponentialNotation('1.234567e+3')).toBe('1234.567');
    expect(expandExponentialNotation('1.2e0')).toBe('1.2');
  });

  it('leaves oversized exponents unexpanded', () => {
    expect(expandExponentialNotation('1e+999999')).toBe('1e+999999');
    expect(expandExponentialNotation('1e-999999')).toBe('1e-999999');
  });
});
