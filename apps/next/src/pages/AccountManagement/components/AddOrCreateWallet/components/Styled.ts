import {
  ListItem as K2ListItem,
  listItemButtonClasses,
  listItemIconClasses,
  styled,
} from '@avalabs/k2-alpine';

export const ListItem = styled(K2ListItem)(({ theme }) => ({
  [`& .${listItemButtonClasses.root}`]: {
    paddingBlock: theme.spacing(0.5),
    paddingInlineStart: theme.spacing(1),
    paddingInlineEnd: theme.spacing(0.5),
  },
  [`& .${listItemIconClasses.root}`]: {
    '&:first-of-type': {
      minWidth: 20,
      paddingInlineEnd: theme.spacing(1.5),
      justifyContent: 'center',
    },
    '&:last-of-type': {
      minWidth: 'auto',
    },
  },
}));
