import { useEffect } from 'react';

const DEBOUNCE_DELAY = 200 as const satisfies number;

export const useDebouncedAmountPropagation = (
  amount: string,
  localAmount: string,
  isReadOnly: boolean,
  onAmountChange?: (amount: string, isMax: boolean) => void,
) => {
  useEffect(() => {
    if (isReadOnly || !onAmountChange) {
      return;
    }

    const timer = setTimeout(() => {
      if (localAmount !== amount) {
        onAmountChange(localAmount, false);
      }
    }, DEBOUNCE_DELAY);
    return () => clearTimeout(timer);
  }, [localAmount, amount, onAmountChange, isReadOnly]);
};
