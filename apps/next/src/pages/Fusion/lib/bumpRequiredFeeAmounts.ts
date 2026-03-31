import { RequiredToken, RequiredTokenAmounts } from '../types';
import { applyBuffer } from './applyBuffer';

export const bumpRequiredFeeAmounts = (
  requiredTokens: RequiredTokenAmounts,
  additionalNativeFeeBuffer: number,
) => {
  return {
    ...requiredTokens,
    tokens: requiredTokens.tokens.map((token) => {
      const newAmounts: RequiredToken['amounts'] = token.amounts.map(
        ([amount, purpose]) => {
          if (purpose !== 'network-fee') {
            return [amount, purpose];
          }
          return [
            applyBuffer(
              amount,
              token.token.decimals,
              additionalNativeFeeBuffer,
            ),
            purpose,
          ];
        },
      );
      const newTotal = newAmounts.reduce(
        (sum, [amount, _]) => sum + amount,
        0n,
      );

      return {
        ...token,
        amounts: newAmounts,
        total: newTotal,
      };
    }),
  };
};
