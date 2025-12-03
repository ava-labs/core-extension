import { balanceToDecimal } from './balanceToDecimal';

describe('balanceToDecimal', () => {
  it('calculates the balance correctly for a balance less than the decimals', () => {
    expect(balanceToDecimal('1', 5)).toBe(0.00001);
  });

  it('calculates the balance correctly for a balance greater than the decimals', () => {
    expect(balanceToDecimal('100000000000000000000', 18)).toBe(100);
  });
});
