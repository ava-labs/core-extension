import { Box, styled } from '@avalabs/k2-alpine';

export const NetworksWithBalancesContainer = styled(Box)<{ index: number }>(
  ({ index }) => ({
    marginLeft: index > 0 ? '-5px' : 0,
    position: 'relative',
    zIndex: index + 1,
  }),
);

export const NetworksWithBalancesItemContainer = styled(Box)<{
  shouldClip: boolean;
}>(({ shouldClip }) => ({
  width: 20,
  height: 20,
  borderRadius: '50%',
  overflow: 'hidden',
  backgroundColor: 'transparent',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  ...(shouldClip && {
    mask: 'url(#crescent-mask)',
    WebkitMask: 'url(#crescent-mask)',
  }),
}));
