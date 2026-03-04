import { useEffect } from 'react';

/**
 *
 * The "amount" prop in the TokenAmountInput component is controlled by both by
 * the component itself (to react to user's input ASAP), and by the parent component
 * (e.g. to update the value when the "Max" button is clicked).
 *
 * This hook is used to update the local value whenever the prop value changes.
 */
export const useUpdateLocalValue = (
  value: string,
  setValue: (value: string) => void,
) => {
  useEffect(() => {
    setValue(value);
  }, [value, setValue]);
};
