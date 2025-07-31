import { useCallback, useEffect, useRef } from 'react';

export type TouchedState<FieldNames extends string> = Partial<
  Record<FieldNames, boolean>
>;
type RefCallback<T> = (instance: T | null) => void;

export interface UseFormFieldTouchedReturn<FieldNames extends string> {
  getFieldRef: <T extends HTMLElement = HTMLElement>(
    fieldName: FieldNames,
  ) => RefCallback<T>;
  isTouched: (fieldNames: FieldNames | FieldNames[]) => boolean;
  reset: () => void;
}

export function useFormFieldTouched<
  FieldNames extends string,
>(): UseFormFieldTouchedReturn<FieldNames> {
  const touchedState = useRef<TouchedState<FieldNames>>({});
  const fieldRefs = useRef<
    Partial<Record<FieldNames, RefCallback<HTMLElement>>>
  >({});
  const cleanupFunctions = useRef<Partial<Record<FieldNames, VoidFunction>>>(
    {},
  );

  const getFieldRef = useCallback(
    <T extends HTMLElement = HTMLElement>(
      fieldName: FieldNames,
    ): RefCallback<T> => {
      if (!fieldRefs.current[fieldName]) {
        fieldRefs.current[fieldName] = (element: HTMLElement | null) => {
          // Cleanup previous listeners if any
          if (cleanupFunctions.current[fieldName]) {
            cleanupFunctions.current[fieldName]();
            delete cleanupFunctions.current[fieldName];
          }

          if (element) {
            const inputElement = element.querySelector('input') || element;

            const handleTouch = () => {
              touchedState.current[fieldName] = true;
            };
            const controller = new AbortController();

            // Listen to input event on the actual input element
            inputElement.addEventListener('keydown', handleTouch, {
              signal: controller.signal,
            });

            // Store cleanup function
            cleanupFunctions.current[fieldName] = () => controller.abort();
          }
        };
      }

      return fieldRefs.current[fieldName] as RefCallback<T>;
    },
    [],
  );

  const isTouched = useCallback(
    (fieldNames: FieldNames | FieldNames[]): boolean => {
      if (typeof fieldNames === 'string') {
        return touchedState.current[fieldNames] ?? false;
      }
      return fieldNames.some((fieldName) => touchedState.current[fieldName]);
    },
    [],
  );

  const reset = useCallback(() => {
    touchedState.current = {};
  }, []);

  // Cleanup all event listeners on unmount
  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      Object.values<VoidFunction | undefined>(cleanupFunctions.current).forEach(
        (cleanup) => cleanup?.(),
      );
    };
  }, []);

  return {
    getFieldRef,
    isTouched,
    reset,
  };
}
