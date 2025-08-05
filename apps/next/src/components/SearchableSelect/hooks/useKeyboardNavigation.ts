import { useEffect, useState } from 'react';

import { useKeyboardShortcuts } from '@core/ui';

const scrollOptions = {
  behavior: 'smooth',
  block: 'nearest',
} as const;

const method =
  'scrollIntoViewIfNeeded' in HTMLElement.prototype
    ? 'scrollIntoViewIfNeeded'
    : 'scrollIntoView';

export const useKeyboardNavigation = (
  container: HTMLDivElement | null,
  itemIds: string[],
  defaultFocusedItemId: string,
) => {
  const [focusedItemId, setFocusedItemId] =
    useState<string>(defaultFocusedItemId);

  useEffect(() => {
    if (!focusedItemId || !container) {
      return;
    }

    const item = container.querySelector(
      `[data-item-id="${focusedItemId}"]`,
    ) satisfies HTMLElement | null;

    item?.[method](scrollOptions);
    item?.focus();
  }, [focusedItemId, container]);

  return useKeyboardShortcuts({
    ArrowUp: () => {
      setFocusedItemId(
        (curr) => itemIds[Math.max(itemIds.indexOf(curr) - 1, 0)] ?? curr,
      );
    },
    ArrowDown: () => {
      setFocusedItemId(
        (curr) =>
          itemIds[Math.min(itemIds.indexOf(curr) + 1, itemIds.length - 1)] ??
          curr,
      );
    },
  });
};
