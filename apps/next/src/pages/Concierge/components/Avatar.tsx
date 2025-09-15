import { Stack, styled } from '@avalabs/k2-alpine';

export const Avatar = styled(Stack)(() => ({
  position: 'relative',
  marginLeft: '-24px',
  height: '85px',
  '.text': {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
}));
