import { ethersBigNumberToBig } from '@avalabs/utils-sdk';
import { BigNumber } from 'ethers';

export function calculateGasAndFees(
  gasPrice: BigNumber,
  tokenPrice: number,
  tokenDecimals = 18,
  gasLimit?: number
) {
  const bnFee = gasLimit ? gasPrice.mul(gasLimit) : gasPrice;
  const fee = ethersBigNumberToBig(bnFee, tokenDecimals).toLocaleString(8);
  return {
    gasPrice: gasPrice,
    gasLimit: gasLimit || 0,
    fee,
    bnFee,
    feeUSD: parseFloat((parseFloat(fee) * tokenPrice).toFixed(4)),
  };
}
