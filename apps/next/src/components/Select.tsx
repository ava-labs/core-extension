import {
  ChevronRightIcon,
  Select as K2Select,
  outlinedInputClasses,
  selectClasses,
  SelectProps,
  styled,
} from '@avalabs/k2-alpine';
import { FC } from 'react';

export const Select: FC<SelectProps> = ({ label, ...props }) => {
  return (
    <SelectWithProperStyling
      label={label as string}
      {...props}
      IconComponent={SelectExpandIcon}
    />
  );
};

const SelectExpandIcon: FC = () => <ChevronRightIcon size={20} />;

const SelectWithProperStyling = styled(K2Select)(({ theme }) => ({
  [`&.${selectClasses.root}`]: {
    height: 40,
    paddingInline: theme.spacing(1.75),
    borderRadius: theme.shape.borderRadius,
    backgroundColor:
      theme.palette.mode === 'light'
        ? theme.palette.surface.primary
        : theme.palette.background.paper,
  },
  [`& .${selectClasses.select}`]: {
    width: 'auto',
    marginLeft: 'auto',
    color: theme.palette.text.secondary,
    ...theme.typography.subtitle1,
  },
  [`& .${outlinedInputClasses.notchedOutline}`]: {
    all: 'unset',
    order: -1,
  },
  [`& legend`]: {
    all: 'unset',
    height: '100%',
    display: 'flex',
    alignItems: 'center',

    '& > span': {
      all: 'unset',
      ...theme.typography.subtitle1,
    },
  },
}));
