import { BtcTxSigningData } from '../types';

export const getInitialFeeRate = (
  data?: BtcTxSigningData,
): bigint | undefined => {
  if (!data) {
    return undefined;
  }

  return data.data.feeRate ? BigInt(data.data.feeRate) : undefined;
};
