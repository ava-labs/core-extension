import { Box, styled } from '@avalabs/k2-alpine';
import { MdEdit } from 'react-icons/md';

export const Wrapper = styled(Box)({
  position: 'relative',
  display: 'inline-block',
  cursor: 'pointer',
  '&:hover': {
    mixBlendMode: 'exclusion',
  },
});

export const EditIcon = styled(MdEdit)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  pointerEvents: 'none',
  opacity: 0,
  transition: theme.transitions.create(['opacity']),

  [`*:hover > &`]: {
    opacity: 1,
  },
}));
