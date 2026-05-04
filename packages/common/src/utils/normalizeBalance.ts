import { bnToBig } from '@avalabs/core-utils-sdk';
import Big from 'big.js';
import { isBN } from 'bn.js';
import type BN from 'bn.js';

import { bigintToBig } from './bigintToBig';

export function normalizeBalance(
  balance: BN | Big | bigint | undefined,
  decimals: number,
): Big | undefined {
  if (isBN(balance)) {
    return bnToBig(balance, decimals);
  }

  if (typeof balance === 'bigint') {
    return bigintToBig(balance, decimals);
  }

  return balance;
}

export function btcToSatoshi(btc: Big): number {
  return btc.mul(100_000_000).toNumber();
}

export function satoshiToBtc(satoshis: number): Big {
  return new Big(satoshis).div(100_000_000);
}
