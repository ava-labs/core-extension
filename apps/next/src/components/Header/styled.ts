import { getHexAlpha, Stack, styled } from '@avalabs/k2-alpine';

export const HeaderContainer = styled(Stack)(({ theme }) => ({
  position: 'relative',
  top: 0,
  left: 0,
  width: '100%',
  zIndex: theme.zIndex.appBar,
  borderBottom: `1px solid ${getHexAlpha(theme.palette.primary.main, 10)}`,
  overflow: 'visible',
}));

export const HeaderNavigationContainer = styled(Stack)(({ theme }) => ({
  background: theme.palette.background.default,
  width: '100%',
  height: '56px',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingLeft: theme.spacing(0.5),
  paddingRight: theme.spacing(0.5),
  zIndex: theme.zIndex.tooltip + 1,
  overflow: 'visible',
  flexDirection: 'row',
}));
