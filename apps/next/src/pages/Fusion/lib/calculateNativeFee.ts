import { isNativeToken } from '@core/types';

import { RequiredTokenAmounts } from '@/pages/Fusion/types';

import { sumByPurpose } from './sumByPurpose';

export const calculateNativeFee = (requiredTokens: RequiredTokenAmounts) => {
  const nativeToken = requiredTokens.tokens.find(({ token }) =>
    isNativeToken(token),
  );

  if (!nativeToken) {
    return 0n;
  }

  return sumByPurpose(nativeToken, 'network-fee');
};
