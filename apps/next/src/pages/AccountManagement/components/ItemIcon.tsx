import { getHexAlpha, ListItemIcon, styled } from '@avalabs/k2-alpine';

export const ItemIcon = styled(ListItemIcon)(({ theme }) => ({
  minWidth: 36,
  svg: {
    borderRadius: '50%',
    boxShadow: `inset 0 0 10px ${getHexAlpha(theme.palette.primary.main, 30)}`,
  },
}));
