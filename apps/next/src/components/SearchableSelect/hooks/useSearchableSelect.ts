import { useRef } from 'react';
import { useCallback, useMemo, useState } from 'react';

import { useKeyboardShortcuts } from '@core/ui';

import {
  Group,
  UseSearchableSelectProps,
  UseSearchableSelectReturnValues,
} from '../types';

export function useSearchableSelect<T>({
  id,
  options,
  isOptionEqualToValue,
  query,
  onQueryChange,
  value,
  searchFn,
  getOptionId,
  onValueChange,
  groupBy,
  setIsOpen,
  skipHeaderForGroups = [],
}: UseSearchableSelectProps<T>): UseSearchableSelectReturnValues<T> {
  const [root, setRoot] = useState<HTMLElement | null>(null);
  const highlightedId = useRef<string | null>(null);

  const selectOption = useCallback(
    (option: T) => {
      onValueChange(option);
      // Close the menu
      setIsOpen(false);
    },
    [onValueChange, setIsOpen],
  );

  const getGroupHeaderProps = useCallback(
    (group: Group<T>) => {
      return {
        role: 'group',
        tabIndex: -1,
        skipHeader: skipHeaderForGroups.includes(group.id),
        'data-group-id': group.id,
      };
    },
    [skipHeaderForGroups],
  );

  const getOptionProps = useCallback(
    (option: T) => {
      const isSelected = value ? isOptionEqualToValue(option, value) : false;
      return {
        role: 'option',
        tabIndex: -1,
        isSelected,
        'data-option-id': getOptionId(option),
        'aria-selected': isSelected,
        onClick: () => selectOption(option),
      };
    },
    [isOptionEqualToValue, value, getOptionId, selectOption],
  );

  const filteredOptions = useMemo(
    () => options.filter((option) => searchFn(option, query)),
    [options, searchFn, query],
  );

  const groupedOptions = useMemo(() => {
    // If no groupBy is provided, return a single group with all options
    if (typeof groupBy !== 'function') {
      return [
        {
          id: '',
          options: filteredOptions,
        },
      ];
    }

    const groupsMap = filteredOptions.reduce(
      (acc, option) => {
        const groupId = groupBy(option);

        if (groupId in acc && Array.isArray(acc[groupId])) {
          acc[groupId].push(option);
        } else {
          acc[groupId] = [option];
        }

        return acc;
      },
      {} as Record<string, T[]>,
    );

    return Object.entries(groupsMap).map(([groupId, groupOptions]) => ({
      id: groupId,
      options: groupOptions,
    })) satisfies Group<T>[];
  }, [filteredOptions, groupBy]);

  const moveHighlight = useCallback(
    (direction: 'up' | 'down') => {
      if (!root) {
        return;
      }

      const allItems = Array.from(
        root.querySelectorAll(
          '[role="option"][data-option-id],[role="group"][data-group-id]',
        ),
      );
      const focusedIndex = allItems.findIndex((item) =>
        item.classList.contains('Mui-focused'),
      );

      const focusedItem = allItems[focusedIndex];

      if (focusedItem) {
        focusedItem.classList.remove('Mui-focused', 'Mui-focusVisible');
      }

      let itemToFocus: Element | undefined;

      if (direction === 'down') {
        itemToFocus =
          focusedIndex === -1 || focusedIndex === allItems.length - 1
            ? allItems[0]
            : allItems[focusedIndex + 1];
      } else {
        itemToFocus =
          focusedIndex <= 0
            ? allItems[allItems.length - 1]
            : allItems[focusedIndex - 1];
      }

      if (itemToFocus) {
        itemToFocus.classList.add('Mui-focused', 'Mui-focusVisible');
        highlightedId.current =
          itemToFocus.getAttribute('data-option-id') ??
          itemToFocus.getAttribute('data-group-id');
      } else {
        highlightedId.current = null;
      }
    },
    [root],
  );

  const keyboardHandlers = useMemo(
    () => ({
      ArrowDown: () => moveHighlight('down'),
      ArrowUp: () => moveHighlight('up'),
      Enter: () => {
        if (!highlightedId.current) {
          return;
        }

        const newValue = filteredOptions.find(
          (option) => getOptionId(option) === highlightedId.current,
        );

        if (newValue) {
          selectOption(newValue);
          return;
        }

        const groupHeader = root?.querySelector(
          `[data-group-id="${highlightedId.current}"]`,
        );

        if (groupHeader) {
          (groupHeader as HTMLElement).click();
        }
      },
    }),
    [moveHighlight, filteredOptions, getOptionId, root, selectOption],
  );

  const keyboardShortcuts = useKeyboardShortcuts(keyboardHandlers);

  const getRootProps = useCallback(
    () => ({
      id,
      ...keyboardShortcuts,
    }),
    [id, keyboardShortcuts],
  );

  const getSearchInputProps = useCallback(() => {
    return {
      defaultValue: query,
      onChange: (ev) => onQueryChange(ev.target.value),
      onKeyDown: (ev) => {
        if (ev.key === 'Enter' && filteredOptions.length === 1) {
          ev.preventDefault();
          ev.stopPropagation();
          selectOption(filteredOptions[0]!);
        }
      },
    };
  }, [query, onQueryChange, filteredOptions, selectOption]);

  return {
    setRoot,
    groupedOptions,
    getGroupHeaderProps,
    getOptionProps,
    getRootProps,
    getSearchInputProps,
    isListNarrowedDown: options.length > filteredOptions.length,
  };
}
