import {
  Divider as K2Divider,
  ListItemButton as K2ListItemButton,
  listItemButtonClasses,
  styled,
} from '@avalabs/k2-alpine';
import { MdErrorOutline } from 'react-icons/md';

export const ErrorIcon = styled(MdErrorOutline)(({ theme }) => ({
  color: theme.palette.error.main,
  flexShrink: 0,
}));

export const ListItemButton = styled(K2ListItemButton)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'auto 1fr auto',
  gap: theme.spacing(0.75),
  height: '40px',
  paddingBlock: theme.spacing(1),
  paddingLeft: theme.spacing(1),
  paddingRight: theme.spacing(2.5),
  borderRadius: theme.spacing(1),

  [`&.${listItemButtonClasses.selected}`]: {
    backgroundColor: theme.palette.background.paper,
  },
}));

export const AccountDivider = styled(K2Divider)(({ theme }) => ({
  marginLeft: theme.spacing(3.5),
  '&.account-divider-hidden': {
    opacity: 0,
  },
  // Hide divider when previous account item is hovered (divider after hovered item)
  '.account-item:hover + &': {
    opacity: 0,
  },
  // Hide divider when next account item is hovered (divider before hovered item)
  '&:has(+ .account-item:hover)': {
    opacity: 0,
  },
}));
