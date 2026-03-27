import { RequiredTokenAmounts } from '@/pages/Fusion/types';

import { sumByPurpose } from './sumByPurpose';

export const calculateMaxAmount = (
  sourceTokenId: string,
  sourceTokenBalance: bigint,
  requiredTokens: RequiredTokenAmounts,
) => {
  const requiredToken = requiredTokens.tokens.find(
    (token) => token.id === sourceTokenId,
  );

  if (!requiredToken) {
    return sourceTokenBalance;
  }

  const networkFee = sumByPurpose(requiredToken, 'network-fee');
  const additiveFees = sumByPurpose(requiredToken, 'additive-fee');

  return sourceTokenBalance - networkFee - additiveFees;
};
