import { DropdownMenu } from '@/components/DropdownMenu';
import { Box, PopoverItem } from '@avalabs/k2-alpine';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { AssetSortOption } from '../../../utils/assetSorting';

export type SortMenuProps = {
  id: string;
  sort: AssetSortOption | null;
  onSortChange: (sort: AssetSortOption | null) => void;
};

export const SortMenu: FC<SortMenuProps> = ({ id, sort, onSortChange }) => {
  const { t } = useTranslation();

  const sortOptions: { label: string; value: AssetSortOption }[] = [
    { label: t('Default'), value: 'default' },
    { label: t('Balance'), value: 'balance' },
    { label: t('Name A to Z'), value: 'name-asc' },
    { label: t('Name Z to A'), value: 'name-desc' },
  ];

  return (
    <Box id={id}>
      <DropdownMenu label={t('Sort')}>
        {sortOptions.map((option) => (
          <PopoverItem
            key={option.value}
            onClick={() => {
              onSortChange(option.value);
            }}
            selected={
              sort === option.value ||
              (sort === null && option.value === 'default')
            }
          >
            {option.label}
          </PopoverItem>
        ))}
      </DropdownMenu>
    </Box>
  );
};
