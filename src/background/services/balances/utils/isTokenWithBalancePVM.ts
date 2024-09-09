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
  return (
    'balancePerType' in balance && 'lockedStaked' in balance.balancePerType
  );
};
