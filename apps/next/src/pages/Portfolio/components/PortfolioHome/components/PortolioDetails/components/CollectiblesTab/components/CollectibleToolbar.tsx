import { Button, Stack } from '@avalabs/k2-alpine';
import type {
  MediaTypeFilters,
  SortMode,
} from '../hooks/useCollectiblesToolbar';
import { CollectiblesFilter } from './CollectiblesFilter';
import { CollectiblesSort } from './CollectiblesSort';
import { useTranslation } from 'react-i18next';

export type CollectibleToolbarProps = {
  mediaFilters: MediaTypeFilters;
  toggleMediaFilter: (filterType: keyof MediaTypeFilters) => void;
  toggleNetworkFilter: (chainId: number) => void;
  sortOption: SortMode;
  setSortOption: (option: SortMode) => void;
  toggleOpenManageDialog: () => void;
  networkFilters: Set<number>;
  clearNetworkFilter: () => void;
};

export const CollectibleToolbar = ({
  mediaFilters,
  toggleMediaFilter,
  sortOption,
  setSortOption,
  toggleOpenManageDialog,
  toggleNetworkFilter,
  networkFilters,
  clearNetworkFilter,
}: CollectibleToolbarProps) => {
  const { t } = useTranslation();
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      width="100%"
    >
      <Stack direction="row" gap={1}>
        <CollectiblesFilter
          typeFilter={mediaFilters}
          onTypeChange={toggleMediaFilter}
          selectedNetworks={Array.from(networkFilters)}
          onNetworkChange={toggleNetworkFilter}
          clearNetworkFilter={clearNetworkFilter}
        />
        <CollectiblesSort
          sortOption={sortOption}
          setSortOption={setSortOption}
        />
      </Stack>
      <Button
        variant="contained"
        color="secondary"
        size="xsmall"
        onClick={toggleOpenManageDialog}
      >
        {t('Manage')}
      </Button>
    </Stack>
  );
};
