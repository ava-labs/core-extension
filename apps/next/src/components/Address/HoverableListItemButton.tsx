import { Button, listItemClasses, styled } from '@avalabs/k2-alpine';

export const HoverableListItemButton = styled(Button)(({ theme }) => ({
  opacity: 0,
  transition: theme.transitions.create(['opacity']),

  [`.${listItemClasses.root}:hover &`]: {
    opacity: 1,
  },
}));
