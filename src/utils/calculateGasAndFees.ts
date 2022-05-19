import { ethersBigNumberToBig } from '@avalabs/utils-sdk';
import { BigNumber } from 'ethers';

export function calculateGasAndFees(
  gasPrice: BigNumber,
  gasLimit: number,
  avaxPrice: number
) {
  const bnFee = gasLimit ? gasPrice.mul(gasLimit) : BigNumber.from(0);
  const fee = ethersBigNumberToBig(bnFee, 18).toLocaleString(4);
  return {
    gasPrice: gasPrice,
    gasLimit: gasLimit || 0,
    fee,
    bnFee,
    feeUSD: parseFloat((parseFloat(fee) * avaxPrice).toFixed(4)),
  };
}
