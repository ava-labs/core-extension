import { bnToBig } from '@avalabs/core-utils-sdk';
import type Big from 'big.js';
import { isBN } from 'bn.js';
import type BN from 'bn.js';

import { bigintToBig } from './bigintToBig';

export function normalizeBalance(
  balance: BN | Big | bigint | undefined,
  decimals: number
): Big | undefined {
  if (isBN(balance)) {
    return bnToBig(balance, decimals);
  }

  if (typeof balance === 'bigint') {
    return bigintToBig(balance, decimals);
  }

  return balance;
}
