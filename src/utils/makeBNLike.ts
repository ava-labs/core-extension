import { BNLike } from 'ethereumjs-util';
import { BigNumberish } from 'ethers';

export function makeBNLike(
  n: BigNumberish | undefined | null,
): BNLike | undefined {
  if (n == null) return undefined;
  return '0x' + BigInt(n).toString(16);
}
