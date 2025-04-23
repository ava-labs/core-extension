import { bnToBig } from '@avalabs/core-utils-sdk';
import Big from 'big.js';
import { BN } from 'bn.js';

export function bigintToBig(amount: bigint, denomination: number): Big {
  return bnToBig(new BN(amount.toString()), denomination);
}
