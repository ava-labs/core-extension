import { bigToLocaleString } from '@avalabs/core-utils-sdk';
import { bigintToBig } from './bigintToBig';

type GasPriceArgs =
  | {
      gasPrice: bigint;
      maxFeePerGas?: never;
      maxPriorityFeePerGas?: never;
    }
  | {
      gasPrice?: never;
      maxFeePerGas: bigint;
      maxPriorityFeePerGas?: bigint;
    };

type Args = GasPriceArgs & {
  tokenPrice?: number;
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

  const bnFee = gasLimit ? pricePerGas * BigInt(gasLimit) : pricePerGas;
  const bnTip =
    gasLimit && maxPriorityFeePerGas
      ? maxPriorityFeePerGas * BigInt(gasLimit)
      : maxPriorityFeePerGas;

  const fee = bigToLocaleString(bigintToBig(bnFee, tokenDecimals), 8);
  const tip = bnTip
    ? bigToLocaleString(bigintToBig(bnTip, tokenDecimals), 8)
    : null;

  const feeUSD = tokenPrice
    ? parseFloat((parseFloat(fee) * tokenPrice).toFixed(4))
    : null;
  const tipUSD =
    tokenPrice && tip
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
