import { EvmTxSigningData } from '../types';

export const getInitialFeeRate = (
  data?: EvmTxSigningData,
): bigint | undefined => {
  if (!data) {
    return undefined;
  }

  return data.data.maxFeePerGas ? BigInt(data.data.maxFeePerGas) : undefined;
};
