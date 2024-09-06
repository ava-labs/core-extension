import {
  TokenWithBalance,
  TokenWithBalancePVM,
} from '@avalabs/vm-module-types';

export const isTokenWithBalancePVM = (
  balance?: TokenWithBalance
): balance is TokenWithBalancePVM => {
  if (!balance) {
    return false;
  }
  return Object.keys(balance).includes('lockedStaked');
};
