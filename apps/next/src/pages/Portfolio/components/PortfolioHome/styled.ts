import { alpha, Stack, styled } from '@avalabs/k2-alpine';

export const TabsContainer = styled(Stack)(({ theme }) => ({
  position: 'sticky',
  bottom: 0,
  paddingTop: theme.spacing(1),
  zIndex: theme.zIndex.appBar,
  background: `linear-gradient(180deg, ${alpha(theme.palette.background.default, 0)} 0%, ${theme.palette.background.default} 16px)`,

  '> div': {
    background: 'unset',
  },
}));
