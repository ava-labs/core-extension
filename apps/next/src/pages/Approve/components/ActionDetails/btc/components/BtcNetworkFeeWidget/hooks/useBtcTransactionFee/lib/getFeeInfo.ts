import { BtcTxSigningData } from '../types';

export const getFeeInfo = ({ data }: BtcTxSigningData) => ({
  feeRate: BigInt(data.feeRate),
  limit: Math.ceil(data.fee / data.feeRate) || 0,
});
