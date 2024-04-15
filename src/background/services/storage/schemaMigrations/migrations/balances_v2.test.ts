import balances_v2, { PreviousSchema } from './balances_v2';

describe('background/services/storage/schemaMigrations/migrations/balances_v2', () => {
  const previousValue: PreviousSchema = {
    balances: {},
    lastUpdated: Date.now(),
    totalBalance: {
      'abcd-1234': 1337.37,
      'abcd-1234-test': 42.42,
    },
  };

  it('accepts correct inputs', () => {
    const result = balances_v2.previousSchema.validate(previousValue);

    expect(result).toEqual({
      error: undefined,
      value: previousValue,
    });

    const resultNull = balances_v2.previousSchema.validate(undefined);

    expect(resultNull).toEqual({
      error: undefined,
      value: undefined,
    });
  });

  it('transforms old balances into new', async () => {
    const newBalances = await balances_v2.up(previousValue);

    expect(newBalances).toEqual({
      ...previousValue,
      totalBalance: {
        'abcd-1234': {
          sum: 1337.37,
          priceChange: {
            value: 0,
            percentage: [],
          },
        },
        'abcd-1234-test': {
          sum: 42.42,
          priceChange: {
            value: 0,
            percentage: [],
          },
        },
      },
      version: 2,
    });
  });
});
