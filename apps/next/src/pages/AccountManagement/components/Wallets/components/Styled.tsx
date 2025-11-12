import {
  ListItemButton as K2ListItemButton,
  listItemButtonClasses,
  styled,
} from '@avalabs/k2-alpine';
import { MdError } from 'react-icons/md';

export const ErrorIcon = styled(MdError)(({ theme }) => ({
  color: theme.palette.error.main,
  flexShrink: 0,
}));

export const ListItemButton = styled(K2ListItemButton)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'auto 1fr auto',
  gap: theme.spacing(0.75),
  paddingLeft: theme.spacing(0.25),
  paddingRight: theme.spacing(2),
  borderRadius: theme.spacing(1.5),

  [`&.${listItemButtonClasses.selected}`]: {
    backgroundColor: theme.palette.background.paper,
  },
}));
