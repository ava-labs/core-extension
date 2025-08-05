import { useMemo } from 'react';
import { AccountGroup } from '../types';

export const useFocusableItemIds = (
  groups: AccountGroup[],
  searchInputId: string,
) => {
  return useMemo(
    () => [
      searchInputId,
      ...groups.flatMap((group) => [
        group.id,
        ...group.items.map((item) => item.id),
      ]),
    ],
    [searchInputId, groups],
  );
};
