import {
  Select as K2Select,
  MenuItem,
  listItemClasses,
  listItemIconClasses,
  selectClasses,
  styled,
} from '@avalabs/k2-alpine';

export const HidingMenuItem = styled(MenuItem)(({ disabled, theme }) => ({
  display: disabled ? 'none' : undefined,
  gap: theme.spacing(1.25),
  alignItems: 'center',
  justifyContent: 'flex-start',
}));

export const Select = styled(K2Select)(({ theme }) => ({
  [`&.${selectClasses.root}`]: {
    width: 'auto',
    borderRadius: theme.shape.fullBorderRadius,
    paddingBlock: theme.spacing(0.25),
    paddingInline: theme.spacing(1.5),
    backgroundColor:
      theme.palette.mode === 'light'
        ? theme.palette.surface.primary
        : theme.palette.background.paper,
  },

  [`& .${selectClasses.select}`]: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: theme.spacing(1.25),
  },

  [`& .${listItemClasses.root}`]: {
    padding: theme.spacing(0),
    gap: theme.spacing(1),
  },

  [`& .${listItemIconClasses.root}`]: {
    minWidth: 'unset',
  },
}));
