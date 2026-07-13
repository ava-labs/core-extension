import { toLower } from 'lodash';
import { POLYMARKET_CONTRACTS } from '@avalabs/prediction-market-sdk/polymarket';

const POLYMARKET_CONTRACTS_SET = new Set(
  Object.values(POLYMARKET_CONTRACTS).map(toLower),
);

export const isPolymarketContract = (to?: string): boolean => {
  if (!to) {
    return false;
  }

  return POLYMARKET_CONTRACTS_SET.has(to.toLowerCase());
};
