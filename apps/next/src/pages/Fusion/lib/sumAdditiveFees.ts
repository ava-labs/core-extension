import { isAddressEqual } from 'viem';
import { bigToBigInt } from '@avalabs/core-utils-sdk';
import { QuoteFee, TokenType } from '@avalabs/fusion-sdk';

import {
  FungibleTokenBalance,
  isErc20Token,
  isNativeToken,
  isSolanaSplToken,
} from '@core/types';
import { bigintToBig } from '@core/common';

export const sumAdditiveFees = (
  sourceToken: FungibleTokenBalance,
  additiveFees: QuoteFee[],
  bufferMultiplier: number,
) => {
  const feesAmount = additiveFees.reduce((sum, fee) => {
    if (isNativeToken(sourceToken) && fee.token.type === TokenType.NATIVE) {
      return sum + fee.amount;
    } else if (
      isErc20Token(sourceToken) &&
      fee.token.type === TokenType.ERC20 &&
      isAddressEqual(sourceToken.address as `0x${string}`, fee.token.address)
    ) {
      return sum + fee.amount;
    } else if (
      isSolanaSplToken(sourceToken) &&
      fee.token.type === TokenType.SPL &&
      sourceToken.address === fee.token.address
    ) {
      return sum + fee.amount;
    }

    return sum;
  }, 0n);

  const paddedSum = bigintToBig(feesAmount, sourceToken.decimals).mul(
    bufferMultiplier,
  );

  return bigToBigInt(paddedSum, sourceToken.decimals);
};
