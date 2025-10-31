import {
  Avatar as K2Avatar,
  ChevronRightIcon as K2ChevronRightIcon,
  ListItemButton as K2ListItemButton,
  ListItemIcon as K2ListItemIcon,
  styled,
} from '@avalabs/k2-alpine';

export const Avatar = styled(K2Avatar)(({ theme }) => ({
  width: 30,
  height: 30,
  backgroundColor: theme.palette.surface.secondary,
  color: theme.palette.text.primary,
}));

export const ListItemButton = styled(K2ListItemButton)(({ theme }) => ({
  gap: theme.spacing(1.25),
}));

export const ListItemIcon = styled(K2ListItemIcon)({
  minWidth: 'unset',
});

export const ChevronRightIcon = styled(K2ChevronRightIcon)(({ theme }) => ({
  display: 'block',
  marginBlockStart: 'auto',
  color: theme.palette.text.secondary,
  cursor: 'pointer',
}));
