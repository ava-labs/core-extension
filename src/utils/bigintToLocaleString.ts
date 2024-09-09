import { bigToLocaleString } from '@avalabs/core-utils-sdk';
import { bigintToBig } from './bigintToBig';

export function bigintToLocaleString(val: bigint, decimals = 9): string {
  const bigVal = bigintToBig(val, decimals);
  return bigToLocaleString(bigVal, decimals);
}
