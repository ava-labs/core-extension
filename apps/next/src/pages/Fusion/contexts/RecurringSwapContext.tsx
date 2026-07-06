import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type FC,
  type ReactNode,
} from 'react';

import { useSwapQuery } from '../hooks/useSwapQuery';

export type FrequencyUnit = 'minute' | 'hour' | 'day' | 'week' | 'month';

type RecurringSwapState = {
  isRecurring: boolean;
  setIsRecurring: (value: boolean) => void;
  frequencyQuantity: number;
  setFrequencyQuantity: (value: number) => void;
  frequencyUnit: FrequencyUnit;
  setFrequencyUnit: (value: FrequencyUnit) => void;
  numberOfOrders: number;
  setNumberOfOrders: (value: number) => void;
  resetForm: () => void;
};

const RecurringSwapContext = createContext<RecurringSwapState | undefined>(
  undefined,
);

export const DEFAULT_FREQUENCY_QUANTITY = 1;
export const DEFAULT_FREQUENCY_UNIT: FrequencyUnit = 'week';
export const DEFAULT_NUMBER_OF_ORDERS = 4;

export const MIN_FREQUENCY_QUANTITY = 1;
export const MIN_NUMBER_OF_ORDERS = 2;
// Markr rejects schedules with more than 365 orders server-side (its
// `numberOfOrders` accepts an integer in [2, 365]), so we guard the upper bound
// in the UI before the user attempts the swap.
export const MAX_NUMBER_OF_ORDERS = 365;

export const isNumberOfOrdersAboveMax = (numberOfOrders: number): boolean =>
  numberOfOrders > MAX_NUMBER_OF_ORDERS;

export const isNumberOfOrdersBelowMin = (numberOfOrders: number): boolean =>
  numberOfOrders < MIN_NUMBER_OF_ORDERS;

export const RecurringSwapContextProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  // The toggle state is persisted in the URL so it survives page reloads and
  // can be deep-linked. Frequency / unit / order count stay in local state
  // for now — they can graduate to the URL the same way if needed.
  const { isRecurring: isRecurringRaw, update: updateQuery } = useSwapQuery();
  const isRecurring = isRecurringRaw === 'true';

  const setIsRecurring = useCallback(
    (value: boolean) => {
      updateQuery({ isRecurring: value ? 'true' : 'false' });
    },
    [updateQuery],
  );

  const [frequencyQuantity, setFrequencyQuantity] = useState(
    DEFAULT_FREQUENCY_QUANTITY,
  );
  const [frequencyUnit, setFrequencyUnit] = useState<FrequencyUnit>(
    DEFAULT_FREQUENCY_UNIT,
  );
  const [numberOfOrders, setNumberOfOrders] = useState(
    DEFAULT_NUMBER_OF_ORDERS,
  );

  const resetForm = useCallback(() => {
    setIsRecurring(false);
    setFrequencyQuantity(DEFAULT_FREQUENCY_QUANTITY);
    setFrequencyUnit(DEFAULT_FREQUENCY_UNIT);
    setNumberOfOrders(DEFAULT_NUMBER_OF_ORDERS);
  }, [setIsRecurring]);

  const value = useMemo<RecurringSwapState>(
    () => ({
      isRecurring,
      setIsRecurring,
      frequencyQuantity,
      setFrequencyQuantity,
      frequencyUnit,
      setFrequencyUnit,
      numberOfOrders,
      setNumberOfOrders,
      resetForm,
    }),
    [
      isRecurring,
      setIsRecurring,
      frequencyQuantity,
      frequencyUnit,
      numberOfOrders,
      resetForm,
    ],
  );

  return (
    <RecurringSwapContext.Provider value={value}>
      {children}
    </RecurringSwapContext.Provider>
  );
};

export const useRecurringSwapState = () => {
  const context = useContext(RecurringSwapContext);
  if (!context) {
    throw new Error(
      'useRecurringSwapState must be used within RecurringSwapContextProvider',
    );
  }
  return context;
};
