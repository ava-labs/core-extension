import {
  TokenWithBalance,
  TokenWithBalanceAVM,
} from '@avalabs/vm-module-types';

export const isTokenWithBalanceAVM = (
  balance?: TokenWithBalance,
): balance is TokenWithBalanceAVM => {
  if (!balance) {
    return false;
  }

  return (
    'balancePerType' in balance &&
    ('locked' in balance.balancePerType || 'unlocked' in balance.balancePerType)
  );
};
