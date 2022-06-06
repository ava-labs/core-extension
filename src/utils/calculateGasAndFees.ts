import { bigToLocaleString, ethersBigNumberToBig } from '@avalabs/utils-sdk';
import { BigNumber } from 'ethers';

export function calculateGasAndFees({
  gasPrice,
  tokenPrice,
  tokenDecimals = 18,
  gasLimit,
}: {
  gasPrice: BigNumber;
  tokenPrice: number;
  tokenDecimals?: number;
  gasLimit?: number;
}) {
  const bnFee = gasLimit ? gasPrice.mul(gasLimit) : gasPrice;
  const fee = bigToLocaleString(ethersBigNumberToBig(bnFee, tokenDecimals), 8);
  return {
    gasPrice: gasPrice,
    gasLimit: gasLimit || 0,
    fee,
    bnFee,
    feeUSD: parseFloat((parseFloat(fee) * tokenPrice).toFixed(4)),
  };
}
