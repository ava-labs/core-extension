import {
  dividerClasses,
  Divider as K2Divider,
  IconButton as K2IconButton,
  List as K2List,
  ListItemIcon as K2ListItemIcon,
  ListSubheader as K2ListSubheader,
  styled,
} from '@avalabs/k2-alpine';

export const List = styled(K2List)(() => ({
  width: '100%',
}));

export const ListSubheader = styled(K2ListSubheader)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? theme.palette.surface.secondary
      : theme.palette.surface.primary,
}));

export const ListItemIcon = styled(K2ListItemIcon)(() => ({
  minWidth: 32,
}));

export const SecondaryActionButton = styled(K2IconButton)(({ theme }) => ({
  padding: theme.spacing(0.25),
}));

export const Divider = styled(K2Divider)(({ theme }) => ({
  [`&.${dividerClasses.inset}`]: {
    marginBlockEnd: theme.spacing(0.5),
    marginInlineStart: theme.spacing(6),
  },
}));
