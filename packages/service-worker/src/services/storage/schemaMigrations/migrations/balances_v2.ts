import Joi from 'joi';
import { Balances, TotalPriceChange } from '@core/types';

const VERSION = 2;

export type PreviousSchema = {
  totalBalance?: {
    [address: string | number]: number | null;
  };
  balances?: Balances;
  lastUpdated?: number;
};

export type NewSchema = {
  totalBalance?: {
    [address: string | number]: {
      sum: number | null;
      priceChange: TotalPriceChange;
    };
  };
  balances?: Balances;
  lastUpdated?: number;
};

const previousSchema = Joi.object();

function transformTotalBalance(
  totalBalance: PreviousSchema['totalBalance'],
): NewSchema['totalBalance'] {
  const newBalance: NewSchema['totalBalance'] = {};

  for (const address in totalBalance) {
    const prevValue = totalBalance[address];

    if (typeof prevValue === 'number' || prevValue === null) {
      newBalance[address] = {
        sum: prevValue,
        priceChange: {
          value: 0,
          percentage: [],
        },
      };
    }
  }

  return newBalance;
}

const up = async (oldBalances: PreviousSchema) => {
  return {
    ...oldBalances,
    totalBalance: oldBalances?.totalBalance
      ? transformTotalBalance(oldBalances.totalBalance)
      : oldBalances?.totalBalance,
    version: VERSION,
  };
};

export default {
  previousSchema,
  up,
};
