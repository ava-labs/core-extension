import { Account } from '@core/types';
import { calculateTotalBalance } from '@core/common';

import { calculateTotalBalanceForAccounts } from './calculateTotalBalanceForAccounts';

jest.mock('@core/common');

describe('src/background/services/balances/handlers/helpers/calculateTotalBalanceForAccounts', () => {
  it('aggregates results of calculateTotalBalance() for provided accounts', () => {
    jest
      .mocked(calculateTotalBalance)
      .mockReturnValueOnce({
        sum: 100,
        priceChange: {
          percentage: [0],
          value: 0,
        },
      })
      .mockReturnValueOnce({
        sum: 0,
        priceChange: {
          percentage: [0],
          value: 0,
        },
      })
      .mockReturnValueOnce({
        sum: null,
        priceChange: {
          percentage: [],
          value: 0,
        },
      })
      .mockReturnValueOnce({
        sum: 1500,
        priceChange: {
          percentage: [0],
          value: 0,
        },
      });

    const accounts: Partial<Account>[] = [
      {
        addressAVM: 'addressAVM',
        addressPVM: 'addressPVM',
      },
      {
        addressPVM: 'addressPVM',
      },
      {
        addressC: 'addressC',
        addressBTC: 'addressBTC',
      },
      {
        addressC: 'addressC',
        addressAVM: 'addressAVM',
        addressPVM: 'addressPVM',
      },
    ];

    const balances = {} as any;
    const chainIds = [];
    const priceChangesData = undefined;

    const result = calculateTotalBalanceForAccounts(
      balances,
      accounts,
      chainIds,
      priceChangesData,
    );

    expect(calculateTotalBalance).toHaveBeenCalledTimes(4);
    expect(calculateTotalBalance).toHaveBeenNthCalledWith(
      1,
      accounts[0],
      chainIds,
      balances,
      true,
      priceChangesData,
    );
    expect(calculateTotalBalance).toHaveBeenNthCalledWith(
      2,
      accounts[1],
      chainIds,
      balances,
      true,
      priceChangesData,
    );
    expect(calculateTotalBalance).toHaveBeenNthCalledWith(
      3,
      accounts[2],
      chainIds,
      balances,
      true,
      priceChangesData,
    );
    expect(calculateTotalBalance).toHaveBeenNthCalledWith(
      4,
      accounts[3],
      chainIds,
      balances,
      true,
      priceChangesData,
    );

    expect(result).toEqual(1600);
  });
});
