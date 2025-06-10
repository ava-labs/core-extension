import {
  NetworkTokenWithBalance,
  TokenWithBalanceERC20,
  TokenWithBalanceSPL,
} from '@avalabs/vm-module-types';

export type SwappableToken =
  | NetworkTokenWithBalance
  | TokenWithBalanceERC20
  | TokenWithBalanceSPL;
