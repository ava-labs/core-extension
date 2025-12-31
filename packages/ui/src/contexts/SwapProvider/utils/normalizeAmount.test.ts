import { normalizeAmountForNotificationForProvider } from './normalizeAmount';
import { SwapProviders } from '../types';

describe('normalizeAmountForNotificationForProvider', () => {
  it('Should return the normalized amount for Markr', () => {
    const expected = '0.1';

    const actual = normalizeAmountForNotificationForProvider({
      provider: SwapProviders.MARKR,
      amount: '0.00001',
      decimal: 4,
    });

    expect(actual).toEqual(expected);
  });

  it('Should return the passed in amount for any other provider', () => {
    const expected = '0.00001';

    const actual = normalizeAmountForNotificationForProvider({
      provider: SwapProviders.JUPITER,
      amount: '0.00001',
      decimal: 4,
    });

    expect(actual).toEqual(expected);
  });
});
