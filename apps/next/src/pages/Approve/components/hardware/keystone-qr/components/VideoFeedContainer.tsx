import { Stack, styled } from '@avalabs/k2-alpine';

export const VideoFeedContainer = styled(Stack)(({ theme }) => ({
  borderRadius: theme.shape.largeBorderRadius,
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.common.black,
  width: '100%',
  height: 240,
  border: `1px solid ${theme.palette.neutral[850]}`,
  overflow: 'hidden',
}));
