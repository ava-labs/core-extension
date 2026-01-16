import { FC } from 'react';
import {
  IconButton,
  SwapVerticalIcon,
  Stack,
  styled,
  getHexAlpha,
} from '@avalabs/k2-alpine';

type PairFlipperProps = {
  disabled: boolean;
  onClick: () => void;
};

export const PairFlipper: FC<PairFlipperProps> = ({ disabled, onClick }) => (
  <FlipContainer>
    <FlipButton color="secondary" disabled={disabled} onClick={onClick}>
      <SwapVerticalIcon size={19} />
    </FlipButton>
  </FlipContainer>
);

const FlipButton = styled(IconButton)(({ theme: { palette } }) => ({
  margin: 'auto',
  color: palette.text.primary,
  backgroundColor:
    palette.mode === 'light' ? palette.glass.dark3 : palette.glass.light2,

  '&.Mui-disabled': {
    pointerEvents: 'auto',
    cursor: 'not-allowed',
    color: getHexAlpha(palette.text.primary, 70),
    backgroundColor: palette.mode === 'light' ? 'glass.dark3' : 'glass.light2',
  },
}));

const FlipContainer = styled(Stack)(({ theme: { palette } }) => ({
  position: 'relative',
  alignItems: 'center',
  justifyContent: 'center',

  '::before, ::after': {
    content: '""',
    position: 'absolute',
    height: '1px',
    backgroundColor: palette.divider,
    width: '50%',
    top: '50%',
  },
  '::before': {
    left: 0,
    transform: 'translateX(-18px)',
  },
  '::after': {
    left: '50%',
    transform: 'translateX(18px)',
  },
}));
