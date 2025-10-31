import { styled } from '@avalabs/k2-alpine';
import { MdSync } from 'react-icons/md';

export const AnimatedSyncIcon = styled(MdSync)(({ theme }) => ({
  color: theme.palette.text.primary,
  transition: theme.transitions.create(['width']),
  animationName: 'rotate',
  animationDuration: '2s',
  animationTimingFunction: 'linear',
  animationIterationCount: 'infinite',

  '&[data-active="false"]': {
    animationPlayState: 'paused',
    width: 0,
  },

  '@keyframes rotate': {
    from: { transform: 'rotate(360deg)' },
    to: { transform: 'rotate(0deg)' },
  },
}));
