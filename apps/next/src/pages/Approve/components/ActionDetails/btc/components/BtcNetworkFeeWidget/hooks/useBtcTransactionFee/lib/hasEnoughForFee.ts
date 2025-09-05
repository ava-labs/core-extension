import { NativeTokenBalance } from '@core/types';

import { BtcTxSigningData } from '../types';
import { getFeeInfo } from './getFeeInfo';

export const hasEnoughForFee = (
  data?: BtcTxSigningData,
  nativeToken?: NativeTokenBalance,
) => {
  if (!data || !nativeToken) return false;

  const info = getFeeInfo(data);
  const need = info.feeRate * BigInt(info.limit);

  return nativeToken.balance > need;
};
