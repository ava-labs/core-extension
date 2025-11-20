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
  sortOption: SortMode;
  setSortOption: (option: SortMode) => void;
  toggleOpenManageDialog: () => void;
};

export const CollectibleToolbar = ({
  mediaFilters,
  toggleMediaFilter,
  sortOption,
  setSortOption,
  toggleOpenManageDialog,
}: CollectibleToolbarProps) => {
  const { t } = useTranslation();
  return (
    <Stack
      spacing={1}
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      width="100%"
    >
      <Stack direction="row" spacing={1}>
        <CollectiblesFilter
          typeFilter={mediaFilters}
          onTypeChange={toggleMediaFilter}
        />
        <CollectiblesSort
          sortOption={sortOption}
          setSortOption={setSortOption}
        />
      </Stack>
      <Button
        variant="contained"
        color="secondary"
        size="small"
        onClick={toggleOpenManageDialog}
      >
        {t('Manage')}
      </Button>
    </Stack>
  );
};
