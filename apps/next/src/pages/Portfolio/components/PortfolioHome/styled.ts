import {
  alpha,
  Stack,
  styled,
  TabBar as K2_TabBar,
  tabClasses,
} from '@avalabs/k2-alpine';

export const TabsContainer = styled(Stack)(({ theme }) => ({
  position: 'sticky',
  bottom: 0,
  paddingTop: theme.spacing(1),
  zIndex: theme.zIndex.appBar,
  background: `linear-gradient(180deg, ${alpha(theme.palette.background.default, 0)} 0%, ${theme.palette.background.default} 16px)`,

  '> div': {
    background: 'unset',
    paddingBottom: '13px',
  },
}));

export const TabBar = styled(K2_TabBar)(() => ({
  maxHeight: '32px',
  [`& .${tabClasses.root}`]: {
    maxHeight: '32px',
  },
}));
