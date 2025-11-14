import { useMemo, useState, useCallback } from 'react';
import { filterCollectiblesByMediaType, sortCollectibles } from '../utils';
import { FormattedCollectible } from '../CollectiblesTab';
import { useStorage } from '@/hooks/useStorage';
export type MediaTypeFilters = {
  all: boolean;
  picture: boolean;
  gif: boolean;
  video: boolean;
};

export type SortMode = 'name-asc' | 'name-desc' | 'date-added';
export type FilterType = 'all' | 'picture' | 'gif' | 'video';

/**
 * Filter collectibles by unreachable status and media type
 */
const filterCollectibles = (
  collectibles: FormattedCollectible[],
  mediaFilters: MediaTypeFilters,
  hideUnreachable: boolean,
): FormattedCollectible[] => {
  // First, filter out unreachable collectibles if hideUnreachable is true
  const reachableCollectibles = hideUnreachable
    ? collectibles.filter(
        (collectible) =>
          collectible.metadata?.indexStatus !== 'UNREACHABLE_TOKEN_URI' &&
          collectible.metadata?.indexStatus !== 'INVALID_TOKEN_URI_SCHEME',
      )
    : collectibles;
  // Then apply media type filters
  return filterCollectiblesByMediaType(reachableCollectibles, mediaFilters);
};

export const useCollectiblesToolbar = ({
  collectibles,
}: {
  collectibles: FormattedCollectible[];
}) => {
  const [mediaFilters, setMediaFilters] = useStorage<string, MediaTypeFilters>(
    'collectibles-media-filters',
    {
      all: true,
      picture: true,
      gif: true,
      video: true,
    },
  );
  const [sortOption, setSortOption] = useStorage<string, SortMode>(
    'collectibles-sort-option',
    'name-asc',
  );
  const [openManageDialog, setOpenManageDialog] = useState(false);
  const [showHidden, setShowHidden] = useStorage<string, boolean>(
    'collectibles-show-hidden',
    false,
  );
  const [hideUnreachable, setHideUnreachable] = useStorage<string, boolean>(
    'collectibles-hide-unreachable',
    true,
  );
  const [hiddenCollectiblesIds, setHiddenCollectiblesIds] = useStorage<
    string,
    string[]
  >('hidden-collectibles-ids', []);

  const toggleMediaFilter = useCallback(
    (filterType: keyof MediaTypeFilters) => {
      setMediaFilters((prev) => {
        if (filterType === 'all') {
          // When "all" is selected, set all filters to true
          const newAllValue = !prev.all;
          return {
            all: newAllValue,
            picture: newAllValue,
            gif: newAllValue,
            video: newAllValue,
          };
        } else {
          // If "all" is currently true, deselect everything and select only the clicked filter
          if (prev.all) {
            return {
              all: false,
              picture: false,
              gif: false,
              video: false,
              [filterType]: true,
            };
          }
          // Otherwise, toggle the specific filter
          const newFilters = {
            ...prev,
            all: false,
            [filterType]: !prev[filterType],
          };
          // If all three specific filters are now true, set "all" to true as well
          if (newFilters.picture && newFilters.gif && newFilters.video) {
            newFilters.all = true;
          }
          return newFilters;
        }
      });
    },
    [setMediaFilters],
  );

  const hiddenCollectibles = useMemo(
    () => new Set<string>(hiddenCollectiblesIds),
    [hiddenCollectiblesIds],
  );

  const toggleCollectible = useCallback(
    (collectible: FormattedCollectible) => {
      const id = collectible.uniqueCollectibleId;
      setHiddenCollectiblesIds((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(id)) {
          newSet.delete(id);
        } else {
          newSet.add(id);
        }
        return Array.from(newSet);
      });
    },
    [setHiddenCollectiblesIds],
  );

  const toggleShowHidden = useCallback(() => {
    setShowHidden((prev) => !prev);
  }, [setShowHidden]);

  const toggleHideUnreachable = useCallback(() => {
    setHideUnreachable((prev) => !prev);
  }, [setHideUnreachable]);

  const processedCollectibles = useMemo<FormattedCollectible[]>(() => {
    const filteredCollectibles = filterCollectibles(
      collectibles,
      mediaFilters,
      hideUnreachable,
    );
    const sortedCollectibles = sortCollectibles(
      filteredCollectibles,
      sortOption,
    );

    if (showHidden) {
      // Show all collectibles (both hidden and visible)
      return sortedCollectibles;
    }
    // Filter out hidden collectibles
    return sortedCollectibles.filter(
      (collectible) => !hiddenCollectibles.has(collectible.uniqueCollectibleId),
    );
  }, [
    collectibles,
    mediaFilters,
    hideUnreachable,
    sortOption,
    showHidden,
    hiddenCollectibles,
  ]);

  return {
    processedCollectibles,
    mediaFilters,
    sortOption,
    openManageDialog,
    showHidden,
    hideUnreachable,
    hiddenCollectibles,
    toggleMediaFilter,
    setSortOption,
    setOpenManageDialog,
    toggleShowHidden,
    toggleHideUnreachable,
    toggleCollectible,
  };
};
