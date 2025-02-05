import type { BNLike } from 'ethereumjs-util';
import type { BigNumberish } from 'ethers';

export function makeBNLike(
  n: BigNumberish | undefined | null,
): BNLike | undefined {
  if (n == null) return undefined;
  return '0x' + BigInt(n).toString(16);
}
