import { useMemo, useState, useCallback } from 'react';
import { filterCollectiblesByMediaType, sortCollectibles } from '../utils';
import { FormattedCollectible } from '../CollectiblesTab';
export type MediaTypeFilters = {
  all: boolean;
  picture: boolean;
  gif: boolean;
  video: boolean;
};

export type SortMode = 'name-asc' | 'name-desc' | 'date-added';
export type FilterType = 'all' | 'picture' | 'gif' | 'video';

export const useCollectiblesToolbar = ({
  collectibles,
}: {
  collectibles: FormattedCollectible[];
}) => {
  const [mediaFilters, setMediaFilters] = useState<MediaTypeFilters>({
    all: true,
    picture: true,
    gif: true,
    video: true,
  });
  const [sortOption, setSortOption] = useState<SortMode>('name-asc');
  const [openManageDialog, setOpenManageDialog] = useState(false);
  const [showHidden, setShowHidden] = useState(false);
  const [hiddenCollectiblesIds, setHiddenCollectiblesIds] = useState<string[]>(
    [],
  );

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
    [],
  );

  const hiddenCollectibles = useMemo(
    () => new Set<string>(hiddenCollectiblesIds),
    [hiddenCollectiblesIds],
  );

  const toggleCollectible = useMemo(
    () => (collectible: FormattedCollectible) => {
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
    [],
  );

  const filteredCollectibles = useMemo<FormattedCollectible[]>(
    () => filterCollectiblesByMediaType(collectibles, mediaFilters),
    [collectibles, mediaFilters],
  );

  const toggleShowHidden = useCallback(() => {
    setShowHidden((prev) => !prev);
  }, []);

  const sortedCollectibles = useMemo<FormattedCollectible[]>(
    () => sortCollectibles(filteredCollectibles, sortOption),
    [filteredCollectibles, sortOption],
  );

  const processedCollectibles = useMemo<FormattedCollectible[]>(() => {
    if (showHidden) {
      // Show all collectibles (both hidden and visible)
      return sortedCollectibles;
    }
    // Filter out hidden collectibles
    return sortedCollectibles.filter(
      (collectible) => !hiddenCollectibles.has(collectible.uniqueCollectibleId),
    );
  }, [sortedCollectibles, showHidden, hiddenCollectibles]);

  return {
    processedCollectibles,
    mediaFilters,
    sortOption,
    openManageDialog,
    showHidden,
    hiddenCollectibles,
    toggleMediaFilter,
    setSortOption,
    setOpenManageDialog,
    toggleShowHidden,
    toggleCollectible,
  };
};
