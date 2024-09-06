import {
  TokenWithBalance,
  TokenWithBalanceAVM,
} from '@avalabs/vm-module-types';

export const isTokenWithBalanceAVM = (
  balance?: TokenWithBalance
): balance is TokenWithBalanceAVM => {
  if (!balance) {
    return false;
  }
  return Object.keys(balance).includes('locked');
};
