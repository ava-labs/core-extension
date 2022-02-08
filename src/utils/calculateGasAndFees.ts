import { BN, bigToLocaleString, bnToBig } from '@avalabs/avalanche-wallet-sdk';
import { GasPrice } from '@src/background/services/gas/models';

export function calculateGasAndFees(
  gasPrice: GasPrice,
  gasLimit: string,
  avaxPrice: number
) {
  const bnFee = gasPrice.bn.mul(new BN(parseInt(gasLimit)));
  const fee = bigToLocaleString(bnToBig(bnFee, 18), 4);
  return {
    gasPrice: gasPrice,
    gasLimit: parseInt(gasLimit),
    fee,
    feeUSD: parseFloat((parseFloat(fee) * avaxPrice).toFixed(4)),
  };
}
