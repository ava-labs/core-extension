import { Box, styled } from '@avalabs/k2-alpine';
import { FC, ReactElement } from 'react';
import { MdEdit } from 'react-icons/md';

type Props = {
  children: ReactElement;
  onClick: () => void;
};

export const AvatarEditOverlay: FC<Props> = ({ children, onClick }) => {
  return (
    <Wrapper role="button" tabIndex={0} onClick={onClick}>
      {children}
      <EditIcon size={24} />
    </Wrapper>
  );
};

const Wrapper = styled(Box)({
  position: 'relative',
  display: 'inline-block',
  cursor: 'pointer',
  '&:hover': {
    mixBlendMode: 'exclusion',
  },
});

const EditIcon = styled(MdEdit)(({ theme }) => ({
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
