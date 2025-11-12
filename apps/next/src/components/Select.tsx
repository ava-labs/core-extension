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
      IconComponent={props.disabled ? NoIcon : SelectExpandIcon}
    />
  );
};

const SelectExpandIcon: FC = () => (
  <ChevronRightIcon size={20} sx={{ flexShrink: 0 }} />
);

const NoIcon: FC = () => null;

const SelectWithProperStyling = styled(K2Select)(({ theme }) => ({
  [`&.${selectClasses.root}`]: {
    height: 40,
    paddingInline: theme.spacing(1.75),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.surface.primary,
  },
  [`& .${selectClasses.select}`]: {
    textAlign: 'end',
    fontWeight: 500,
    color: theme.palette.text.secondary,
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
      ...theme.typography.subtitle3,
    },
  },
}));
