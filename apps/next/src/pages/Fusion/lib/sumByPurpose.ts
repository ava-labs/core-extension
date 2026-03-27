import { RequiredToken, RequiredTokenPurpose } from '@/pages/Fusion/types';

export const sumByPurpose = (
  requiredToken: RequiredToken,
  purposeLookup: RequiredTokenPurpose,
) => {
  return requiredToken.amounts
    .filter(([_, purpose]) => purpose === purposeLookup)
    .reduce((acc, [amount]) => acc + amount, 0n);
};
