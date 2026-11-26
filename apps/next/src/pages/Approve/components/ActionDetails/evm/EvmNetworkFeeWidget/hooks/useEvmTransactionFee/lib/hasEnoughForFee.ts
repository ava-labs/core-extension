import { NativeTokenBalance } from '@core/types';

import { EvmTxSigningData } from '../types';
import { getFeeInfo } from './getFeeInfo';

export const hasEnoughForFee = (
  data?: EvmTxSigningData,
  nativeToken?: NativeTokenBalance,
) => {
  if (!data || !nativeToken) return false;

  const info = getFeeInfo(data);
  const need = info.feeRate * BigInt(info.limit) + BigInt(data.data.value ?? 0);

  return nativeToken.balance >= need;
};
