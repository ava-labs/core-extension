import { useKeyboardShortcuts } from '@core/ui';
import { useRef } from 'react';

export function useSubmitButton() {
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  return [
    submitButtonRef,
    useKeyboardShortcuts({
      Enter: () => {
        console.log(
          'Enter pressed. Shortcuts executed',
          submitButtonRef.current,
        );
        submitButtonRef.current?.click();
      },
    }),
  ] as const;
}
