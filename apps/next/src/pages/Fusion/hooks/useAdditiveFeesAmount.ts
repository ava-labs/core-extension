import { useFusionState } from '../contexts';
import { sumAdditiveFees } from '../lib/sumAdditiveFees';
import { getAdditiveFees } from '../lib/getAdditiveFees';
import { bigintToBig } from '@core/common';

const NO_FEES = {
  sum: '',
  symbol: '',
};

export const useAdditiveFeesAmount = () => {
  const { debouncedUserAmount, sourceToken, selectedQuote } = useFusionState();

  if (!debouncedUserAmount || !selectedQuote || !sourceToken) {
    return NO_FEES;
  }

  const additiveFees = getAdditiveFees(selectedQuote);

  if (additiveFees.length === 0) {
    return NO_FEES;
  }

  return {
    sum: bigintToBig(
      sumAdditiveFees(sourceToken, additiveFees, 1),
      sourceToken.decimals,
    ).toFixed(5),
    symbol: sourceToken.symbol,
  };
};
