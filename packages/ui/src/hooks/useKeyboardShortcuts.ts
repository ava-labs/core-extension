import { KeyboardEventHandler, useCallback, useRef } from 'react';

type KeyNames = 'Enter' | 'Escape' | 'ArrowUp' | 'ArrowDown';
type KeyboardShortcuts = Partial<Record<KeyNames, KeyboardEventHandler>>;

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcuts) => {
  const shortcutsRef = useRef(shortcuts);
  shortcutsRef.current = shortcuts;

  const onKeyDown = useCallback<KeyboardEventHandler>(async (event) => {
    const callback = shortcutsRef.current[event.key];

    if (typeof callback === 'function') {
      event.preventDefault();
      await callback(event);
    }
  }, []);

  return {
    onKeyDown,
  };
};
