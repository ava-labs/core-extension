import { Stack, styled } from '@avalabs/k2-alpine';

export const Container = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  minWidth: 0,
  overflow: 'visible',
}));

export const AccountInfoClickableStack = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(0.5),
  borderRadius: theme.spacing(1),
  backgroundColor: theme.palette.background.navBarItem,
  marginY: theme.spacing(0.5),
  cursor: 'pointer',
}));
