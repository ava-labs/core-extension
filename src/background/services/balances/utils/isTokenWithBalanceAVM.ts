import { TokenWithBalance, TokenWithBalanceAVM } from '../models';

export const isTokenWithBalanceAVM = (
  balance?: TokenWithBalance
): balance is TokenWithBalanceAVM => {
  if (!balance) {
    return false;
  }
  return Object.keys(balance).includes('locked');
};
