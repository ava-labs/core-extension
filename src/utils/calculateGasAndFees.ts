import { bigToLocaleString, ethersBigNumberToBig } from '@avalabs/utils-sdk';
import { BigNumber } from 'ethers';

type GasPriceArgs =
  | {
      gasPrice: BigNumber;
      maxFeePerGas?: never;
      maxPriorityFeePerGas?: never;
    }
  | {
      gasPrice?: never;
      maxFeePerGas: BigNumber;
      maxPriorityFeePerGas?: BigNumber;
    };

type Args = GasPriceArgs & {
  tokenPrice: number;
  tokenDecimals?: number;
  gasLimit?: number;
};

export function calculateGasAndFees({
  gasPrice,
  maxFeePerGas,
  maxPriorityFeePerGas,
  tokenPrice,
  tokenDecimals = 18,
  gasLimit,
}: Args) {
  const pricePerGas = maxFeePerGas ?? gasPrice;

  if (pricePerGas == null) {
    throw new Error('Please provide gasPrice or maxFeePerGas parameters');
  }

  const bnFee = gasLimit ? pricePerGas.mul(gasLimit) : pricePerGas;
  const bnTip =
    gasLimit && maxPriorityFeePerGas
      ? maxPriorityFeePerGas.mul(gasLimit)
      : maxPriorityFeePerGas;

  const fee = bigToLocaleString(ethersBigNumberToBig(bnFee, tokenDecimals), 8);
  const tip = bnTip
    ? bigToLocaleString(ethersBigNumberToBig(bnTip, tokenDecimals), 8)
    : null;

  const feeUSD = parseFloat((parseFloat(fee) * tokenPrice).toFixed(4));
  const tipUSD = tip
    ? parseFloat((parseFloat(tip) * tokenPrice).toFixed(4))
    : null;

  return {
    maxFeePerGas: maxFeePerGas,
    gasLimit: gasLimit || 0,
    fee,
    bnFee,
    feeUSD,
    tipUSD,
  };
}
