import { Stack, StackProps, styled } from '@avalabs/k2-alpine';

export const FullscreenModalContent = styled(({ pt, ...props }: StackProps) => (
  <Stack {...props} pt={pt ?? 4} />
))({
  flexGrow: 1,
  height: '100%',
  overflow: 'auto',

  '&::-webkit-scrollbar': {
    display: 'none',
  },
});
