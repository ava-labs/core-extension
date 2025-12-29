import { ListItem, styled } from '@avalabs/k2-alpine';

export const OrderedListItem = styled(ListItem)(({ theme }) => ({
  gap: theme.spacing(1),
  paddingInlineEnd: theme.spacing(4),

  '.MuiCard-root:has(&)': {
    counterReset: 'ordered-list',
  },

  '&:before': {
    content: 'counter(ordered-list)',
    counterIncrement: 'ordered-list',
    display: 'inline-block',
    width: 20,
    height: 20,
    marginBlockStart: theme.spacing(0.5),
    marginBlockEnd: 'auto',
    flexShrink: 0,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    ...theme.typography.body2,
  },
}));
