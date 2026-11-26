import { NativeTokenBalance } from '@core/types';

import { BtcTxSigningData } from '../types';

export const hasEnoughForFee = (
  data?: BtcTxSigningData,
  nativeToken?: NativeTokenBalance,
) => {
  if (!data || !nativeToken) return false;

  const need = BigInt(data.data.fee) + BigInt(data.data.amount);

  return nativeToken.balance >= need;
};
