import { useKeyboardShortcuts } from '@core/ui';
import { useRef } from 'react';

export function useSubmitButton() {
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  return [
    submitButtonRef,
    useKeyboardShortcuts({
      Enter: () => submitButtonRef.current?.click(),
    }),
  ] as const;
}
