import { FC, memo } from 'react';
import {
  CardProps,
  Divider,
  MenuProps,
  SearchInput,
  SearchInputProps,
  SelectProps,
  Stack,
} from '@avalabs/k2-alpine';

import { EnsureDefined } from '@core/types';

import { Card } from '@/components/Card';
import { Select } from '@/components/Select';

type AddressFieldProps = CardProps & {
  selectProps: EnsureDefined<SelectProps, 'renderValue'>;
  withSearchInput?: boolean;
  searchInputProps?: SearchInputProps;
};

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

export const AddressField: FC<AddressFieldProps> = memo(
  ({
    selectProps,
    withSearchInput = true,
    searchInputProps,
    children,
    ...rest
  }) => {
    const { MenuProps: selectMenuProps, ...restSelectProps } =
      selectProps ?? {};

    return (
      <Card {...rest}>
        <Select
          fullWidth
          size="medium"
          MenuProps={{
            ...defaultMenuProps,
            ...selectMenuProps,
          }}
          {...restSelectProps}
        >
          <Stack pt={0.5}>
            {withSearchInput && (
              <>
                <SearchInput
                  autoFocus
                  onClick={(e) => e.stopPropagation()}
                  {...searchInputProps}
                />
                <Divider sx={{ mb: 1 }} />
              </>
            )}
            {children}
          </Stack>
        </Select>
      </Card>
    );
  },
);

AddressField.displayName = 'AddressField';
