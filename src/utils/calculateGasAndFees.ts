import { TokenUnit } from '@avalabs/core-utils-sdk';

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

  const fee = new TokenUnit(bnFee, tokenDecimals, '');
  const tip = bnTip ? new TokenUnit(bnTip, tokenDecimals, '') : null;
  const price = tokenPrice ? new TokenUnit(tokenPrice, 0, '') : null;

  return {
    maxFeePerGas: maxFeePerGas,
    gasLimit: gasLimit || 0,
    fee: fee.toDisplay({ asNumber: true }).toLocaleString(),
    bnFee,
    feeUSD: price
      ? price.mul(fee).toDisplay({ fixedDp: 4, asNumber: true })
      : null,
    tipUSD:
      price && tip
        ? price.mul(tip).toDisplay({ fixedDp: 4, asNumber: true })
        : null,
  };
}
