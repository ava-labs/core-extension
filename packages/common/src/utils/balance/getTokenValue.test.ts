import { getTokenValue } from './getTokenValue';

describe('src/background/services/balances/utils/getTokenValue.ts', () => {
  it('should return 0 if amount is undefined', () => {
    const result = getTokenValue(5, undefined);
    expect(result).toEqual(0);
  });
  it('should return expected value when amount is available', () => {
    const result = getTokenValue(5, 100000);
    expect(result).toEqual(1);
  });
});
