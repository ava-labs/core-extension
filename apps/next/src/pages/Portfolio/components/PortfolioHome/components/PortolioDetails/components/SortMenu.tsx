import {
  List,
  ListItemButton,
  ListItemText,
  Popover,
} from '@avalabs/k2-alpine';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { MdCheck } from 'react-icons/md';
import { AssetSortOption } from '../utils/assetSorting';

export type SortMenuProps = {
  id: string;
  anchorEl: HTMLButtonElement | null;
  open: boolean;
  onClose: () => void;
  sort: AssetSortOption | null;
  onSortChange: (sort: AssetSortOption | null) => void;
};

export const SortMenu: FC<SortMenuProps> = ({
  id,
  anchorEl,
  open,
  onClose,
  sort,
  onSortChange,
}) => {
  const { t } = useTranslation();

  const sortOptions: { label: string; value: AssetSortOption }[] = [
    { label: t('Default'), value: 'default' },
    { label: t('Balance'), value: 'balance' },
    { label: t('Name A to Z'), value: 'name-asc' },
    { label: t('Name Z to A'), value: 'name-desc' },
    { label: t('Quantity'), value: 'balance-quantity' },
    { label: t('Token Price'), value: 'token-price' },
  ];

  return (
    <Popover id={id} open={open} anchorEl={anchorEl} onClose={onClose}>
      <List sx={{ width: '210px' }}>
        {sortOptions.map((option) => (
          <ListItemButton
            key={option.value}
            dense
            sx={{
              paddingY: 0.5,
              borderRadius: 1,
            }}
            onClick={() => {
              onSortChange(option.value);
              onClose();
            }}
            selected={
              sort === option.value ||
              (sort === null && option.value === 'default')
            }
          >
            <ListItemText primary={option.label} />
            {(sort === option.value ||
              (sort === null && option.value === 'default')) && (
              <MdCheck size={16} />
            )}
          </ListItemButton>
        ))}
      </List>
    </Popover>
  );
};
