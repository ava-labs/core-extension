import { ADDRESS_GAP_LIMIT } from '../models';
import { isDone } from './isDone';

describe('src/background/services/balances/handlers/getTotalBalanceForWallet/helpers/isDone', () => {
  it(`returns false beyond ${ADDRESS_GAP_LIMIT}`, () => {
    expect(isDone(ADDRESS_GAP_LIMIT - 1)).toBe(false);
    expect(isDone(ADDRESS_GAP_LIMIT)).toBe(false);
    expect(isDone(ADDRESS_GAP_LIMIT + 1)).toBe(true);
  });
});
