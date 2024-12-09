import { KeyboardEventHandler, useCallback } from 'react';

type Callback = () => void;
type KeyNames = 'Enter' | 'Escape';
type KeyboardShortcuts = Partial<Record<KeyNames, Callback>>;

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcuts) => {
  const onKeyDown: KeyboardEventHandler = useCallback(
    async (event) => {
      const callback = shortcuts[event.key];

      if (typeof callback === 'function') {
        event.preventDefault();
        await callback();
      }
    },
    [shortcuts],
  );

  return {
    onKeyDown,
  };
};
