import {
  Divider,
  MenuProps,
  SearchInput,
  SearchInputProps,
  SelectProps,
  Stack,
  Typography,
} from '@avalabs/k2-alpine';
import { FiAlertCircle } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { Children, FC, PropsWithChildren, useState } from 'react';

import { EnsureDefined } from '@core/types';

import { Select } from '@/components/Select';

import { useKeyboardNavigation } from './hooks';

const defaultMenuProps: Partial<MenuProps> = {
  anchorOrigin: {
    horizontal: 'left',
    vertical: 'top',
  },
  transformOrigin: {
    horizontal: 'center',
    vertical: 'center',
  },
  slotProps: {
    paper: {
      sx: {
        // TODO: remove this once we have a proper scrollbar solution
        '&::-webkit-scrollbar': {
          display: 'none',
        },
      },
    },
  },
  sx: {
    '& .MuiMenu-list': {
      py: 0,
    },
  },
};

type SearchableSelectProps = PropsWithChildren<{
  selectProps: EnsureDefined<SelectProps, 'renderValue'>;
  searchInputId: string;
  withSearchInput?: boolean;
  searchInputProps?: SearchInputProps;
  focusableItemIds?: string[];
}>;

export const SearchableSelect: FC<SearchableSelectProps> = ({
  selectProps,
  searchInputId,
  searchInputProps,
  focusableItemIds,
  children,
}) => {
  const { t } = useTranslation();
  const { MenuProps: menuProps, ...restSelectProps } = selectProps ?? {};

  const [menuElement, setMenuElement] = useState<HTMLDivElement | null>(null);
  const keyboardShortcuts = useKeyboardNavigation(
    menuElement,
    focusableItemIds ?? [],
    searchInputId,
  );

  return (
    <Select
      fullWidth
      size="medium"
      MenuProps={{
        ...defaultMenuProps,
        ...menuProps,
        ...keyboardShortcuts,
        ref: setMenuElement,
      }}
      {...restSelectProps}
    >
      <Stack pt={0.5}>
        <SearchInput
          autoFocus
          onClick={(e) => e.stopPropagation()}
          {...searchInputProps}
        />
        <Divider sx={{ my: 0 }} />
        {children}
        {Children.count(children) === 0 && (
          <Stack
            direction="row"
            p={2}
            alignItems="center"
            gap={1}
            color="error.light"
          >
            <FiAlertCircle size={20} />
            <Typography variant="body2">{t('No results found')}</Typography>
          </Stack>
        )}
      </Stack>
    </Select>
  );
};
