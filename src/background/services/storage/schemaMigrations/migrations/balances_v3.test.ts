import type { PreviousSchema } from './balances_v3';
import balances_v3 from './balances_v3';

describe('background/services/storage/schemaMigrations/migrations/balances_v3', () => {
  const previousValue: PreviousSchema = {
    balances: {
      '1': {
        'address-1-a': {
          'token-address-1-a': {
            balance: 1,
          },
        },
        'address-1-b': {
          'token-address-1-b': {
            balance: 2,
          },
        },
      },
      '137': {
        'address-137-a': {
          POL: {
            balance: 4,
          },
          MATIC: {
            balance: 4,
          },
          'token-address-137-a': {
            balance: 3,
          },
        },
        'address-137-b': {
          POL: {
            balance: 5,
          },
        },
      },
    },
  };

  it('removes MATIC from cached balances and leaves other tokens in tact', async () => {
    const newBalances = await balances_v3.up(previousValue);

    expect(newBalances).toEqual({
      balances: {
        '1': {
          'address-1-a': {
            'token-address-1-a': {
              balance: 1,
            },
          },
          'address-1-b': {
            'token-address-1-b': {
              balance: 2,
            },
          },
        },
        '137': {
          'address-137-a': {
            POL: {
              balance: 4,
            },
            'token-address-137-a': {
              balance: 3,
            },
          },
          'address-137-b': {
            POL: {
              balance: 5,
            },
          },
        },
      },
      version: 3,
    });
  });
});
