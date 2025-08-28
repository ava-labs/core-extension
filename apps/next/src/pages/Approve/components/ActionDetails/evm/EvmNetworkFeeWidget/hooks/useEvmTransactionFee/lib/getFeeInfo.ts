import { EvmTxSigningData } from '../types';

export const getFeeInfo = ({ data }: EvmTxSigningData) => ({
  feeRate: data.maxFeePerGas ? BigInt(data.maxFeePerGas) : 0n,
  maxTipRate: data.maxPriorityFeePerGas
    ? BigInt(data.maxPriorityFeePerGas)
    : 0n,
  limit: Number(data.gasLimit ?? 0),
});
