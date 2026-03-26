import { bigintToBig } from '@core/common';
import { bigToBigInt } from '@avalabs/core-utils-sdk';

export const applyBuffer = (
  amount: bigint,
  decimals: number,
  buffer: number,
) => {
  return bigToBigInt(bigintToBig(amount, decimals).mul(1 + buffer), decimals);
};
