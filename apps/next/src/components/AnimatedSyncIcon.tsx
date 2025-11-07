import { keyframes, styled } from '@avalabs/k2-alpine';
import { MdSync } from 'react-icons/md';

const rotate = keyframes`
  from {
    transform: rotate(360deg);
  }
  to {
    transform: rotate(0deg);
  }
`;

export const AnimatedSyncIcon = styled(MdSync)(({ theme }) => ({
  color: theme.palette.text.primary,
  animation: `${rotate} 2s linear infinite`,

  '*:has(> &[data-hidden="true"])': {
    display: 'none',
  },

  '&[data-active="false"], &[data-hidden="true"]': {
    animationPlayState: 'paused',
  },
}));
