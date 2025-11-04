import animations from '@/lib/animations';
import { styled } from '@avalabs/k2-alpine';
import { MdSync } from 'react-icons/md';

export const AnimatedSyncIcon = styled(MdSync)(({ theme }) => ({
  color: theme.palette.text.primary,
  transition: theme.transitions.create(['width']),
  ...animations.rotate,

  '&[data-hidden="true"]': {
    width: 0,
  },

  '&[data-active="false"], &[data-hidden="true"]': {
    animationPlayState: 'paused',
  },
}));
