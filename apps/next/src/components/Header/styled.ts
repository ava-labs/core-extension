import { getHexAlpha, Stack, styled } from '@avalabs/k2-alpine';
import { HEADER_HEIGHT } from '@/config/constants';

export const HeaderContainer = styled(Stack)(({ theme }) => ({
  position: 'sticky',
  top: 0,
  left: 0,
  width: '100%',
  zIndex: theme.zIndex.appBar,
  borderBottom: `1px solid ${getHexAlpha(theme.palette.primary.main, 10)}`,
  overflow: 'visible',
}));

export const HeaderNavigationContainer = styled(Stack)(({ theme }) => ({
  background: getHexAlpha(theme.palette.background.default, 60),
  backdropFilter: 'blur(30px)',
  WebkitBackdropFilter: 'blur(30px)',
  width: '100%',
  height: `${HEADER_HEIGHT}px`,
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingInline: theme.spacing(0.5),
  zIndex: theme.zIndex.tooltip + 1,
  overflow: 'visible',
  flexDirection: 'row',
}));
