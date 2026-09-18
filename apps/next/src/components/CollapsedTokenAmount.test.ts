import { expandExponentialNotation } from './CollapsedTokenAmount';

describe('expandExponentialNotation', () => {
  it('leaves plain decimal strings untouched', () => {
    expect(expandExponentialNotation('0')).toBe('0');
    expect(expandExponentialNotation('1.23456')).toBe('1.23456');
    expect(expandExponentialNotation('-0.0000001')).toBe('-0.0000001');
    expect(expandExponentialNotation('1234567890123456789')).toBe(
      '1234567890123456789',
    );
  });

  // Bounty #87015: two ERC-1155 amounts 10,000,000x apart used to render
  // identically as "1.23456" because the exponent was truncated away.
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
});
