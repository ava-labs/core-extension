import { useMemo, useState, useCallback } from 'react';
import { flow, isEmpty } from 'lodash';
import {
  filterCollectiblesByMediaType,
  filterCollectiblesByNetworks,
  sortCollectibles,
} from '../utils';
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
  networkFilters: number[] = [],
): FormattedCollectible[] => {
  // First, filter out unreachable collectibles if hideUnreachable is true
  const reachableCollectibles = hideUnreachable
    ? collectibles.filter(
        (collectible) =>
          collectible.metadata?.indexStatus !== 'UNREACHABLE_TOKEN_URI' &&
          collectible.metadata?.indexStatus !== 'INVALID_TOKEN_URI_SCHEME',
      )
    : collectibles;
  // Then apply other filters
  return flow([
    filterCollectiblesByMediaType(mediaFilters),
    filterCollectiblesByNetworks(networkFilters),
  ])(reachableCollectibles) as FormattedCollectible[];
};

export const useCollectiblesToolbar = ({
  collectibles,
  failedCollectibleIds,
}: {
  collectibles: FormattedCollectible[];
  failedCollectibleIds?: Set<string>;
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
  const [networkFilters, setNetworkFilters] = useStorage<string, Set<number>>(
    'collectibles-network-filters',
    new Set(),
  );
  const [sortOption, setSortOption] = useStorage<string, SortMode>(
    'collectibles-sort-option',
    'name-asc',
  );
  const [openManageDialog, setOpenManageDialog] = useState(false);
  const [hideUnreachable, setHideUnreachable] = useStorage<string, boolean>(
    'collectibles-hide-unreachable',
    true,
  );
  const [hiddenCollectiblesIds, setHiddenCollectiblesIds] = useStorage<
    string,
    string[]
  >('hidden-collectibles-ids', []);
  const [hideBrokenImages, setHideBrokenImages] = useStorage<string, boolean>(
    'collectibles-hide-broken-images',
    true,
  );

  const clearNetworkFilter = useCallback(() => {
    setNetworkFilters(new Set());
  }, [setNetworkFilters]);

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

  const toggleNetworkFilter = useCallback(
    (chainId: number) => {
      setNetworkFilters((prev) => {
        const newSelected = isEmpty(prev) ? new Set<number>() : new Set(prev);
        if (newSelected.has(chainId)) {
          newSelected.delete(chainId);
        } else {
          newSelected.add(chainId);
        }
        return newSelected;
      });
    },
    [setNetworkFilters],
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

  const toggleHideUnreachable = useCallback(() => {
    setHideUnreachable((prev) => !prev);
  }, [setHideUnreachable]);

  const processedCollectibles = useMemo<FormattedCollectible[]>(() => {
    const filteredCollectibles = filterCollectibles(
      collectibles,
      mediaFilters,
      hideUnreachable,
      Array.from(networkFilters),
    );
    const sortedCollectibles = sortCollectibles(
      filteredCollectibles,
      sortOption,
    );

    return sortedCollectibles
      .filter(
        (collectible) =>
          !hiddenCollectibles.has(collectible.uniqueCollectibleId),
      )
      .filter((collectible) => {
        if (!hideBrokenImages) return true;
        // Pre-load: hide NFTs that have no media sources at all
        if (
          !collectible.logoUri &&
          !collectible.logoSmall &&
          !collectible.tokenUri
        )
          return false;
        // Post-load: hide NFTs whose media failed to load in the browser
        if (failedCollectibleIds?.has(collectible.uniqueCollectibleId))
          return false;
        return true;
      });
  }, [
    collectibles,
    mediaFilters,
    networkFilters,
    hideUnreachable,
    sortOption,
    hiddenCollectibles,
    hideBrokenImages,
    failedCollectibleIds,
  ]);

  return {
    processedCollectibles,
    mediaFilters,
    sortOption,
    openManageDialog,
    hideUnreachable,
    hiddenCollectibles,
    hideBrokenImages,
    setHideBrokenImages,
    toggleMediaFilter,
    setSortOption,
    setOpenManageDialog,
    toggleHideUnreachable,
    toggleCollectible,
    toggleNetworkFilter,
    networkFilters,
    clearNetworkFilter,
  };
};
