import { DropdownMenu } from '@/components/DropdownMenu';
import { PopoverItem } from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';
import { SortMode } from '../hooks/useCollectiblesToolbar';

export type CollectiblesSortProps = {
  sortOption: SortMode;
  setSortOption: (option: SortMode) => void;
};

export const CollectiblesSort = ({
  sortOption,
  setSortOption,
}: CollectiblesSortProps) => {
  const { t } = useTranslation();
  return (
    <DropdownMenu label={t('Sort')}>
      <PopoverItem
        onClick={() => setSortOption('name-asc')}
        selected={sortOption === 'name-asc'}
      >
        <span data-testid="collectibles-sort-option-name-asc">
          {t('Name (A-Z)')}
        </span>
      </PopoverItem>
      <PopoverItem
        onClick={() => setSortOption('name-desc')}
        selected={sortOption === 'name-desc'}
      >
        <span data-testid="collectibles-sort-option-name-desc">
          {t('Name (Z-A)')}
        </span>
      </PopoverItem>
      <PopoverItem
        onClick={() => setSortOption('date-added')}
        selected={sortOption === 'date-added'}
      >
        <span data-testid="collectibles-sort-option-date-added">
          {t('Date added')}
        </span>
      </PopoverItem>
    </DropdownMenu>
  );
};
