import { bigIntToString } from '@avalabs/core-utils-sdk';

import { useFusionState } from '../contexts';
import { sumAdditiveFees } from '../lib/sumAdditiveFees';

export const useAdditiveFeesAmount = () => {
  const { sourceToken, additiveFees } = useFusionState();

  if (!sourceToken || additiveFees.length === 0) {
    return {
      sum: '',
      symbol: '',
    };
  }

  return {
    sum: bigIntToString(
      sumAdditiveFees(sourceToken, additiveFees, 1),
      sourceToken.decimals,
    ),
    symbol: sourceToken.symbol,
  };
};
