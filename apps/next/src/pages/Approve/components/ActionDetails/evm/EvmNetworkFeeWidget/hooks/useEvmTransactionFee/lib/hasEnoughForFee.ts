import { NativeTokenBalance } from '@core/types';

import { EvmTxSigningData } from '../types';
import { getFeeInfo } from './getFeeInfo';

export const hasEnoughForFee = (
  data?: EvmTxSigningData,
  nativeToken?: NativeTokenBalance,
) => {
  if (!data || !nativeToken) return false;

  const info = getFeeInfo(data);
  const need = info.feeRate * BigInt(info.limit);

  return nativeToken.balance > need;
};
