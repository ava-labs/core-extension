import {
  buttonBaseClasses,
  getHexAlpha,
  IconButton,
  Stack,
  styled,
  SwapIcon,
} from '@avalabs/k2-alpine';
import { FC } from 'react';

type PairFlipperProps = {
  disabled: boolean;
  onClick: () => void;
};

export const PairFlipper: FC<PairFlipperProps> = ({ disabled, onClick }) => {
  return (
    <Stack alignItems="center" justifyContent="center">
      <FlipButton color="secondary" disabled={disabled} onClick={onClick}>
        <SwapIcon
          size={20}
          style={{
            transform: 'rotate(90deg) translate(-2px, -2px)',
          }}
        />
      </FlipButton>
    </Stack>
  );
};

const FlipButton = styled(IconButton)(({ theme: { palette } }) => ({
  margin: 'auto',
  color: palette.text.primary,
  backgroundColor:
    palette.mode === 'light' ? palette.glass.dark3 : palette.glass.light2,

  [`&.${buttonBaseClasses.disabled}`]: {
    pointerEvents: 'auto',
    cursor: 'not-allowed',
    color: getHexAlpha(palette.text.primary, 70),
    backgroundColor: palette.mode === 'light' ? 'glass.dark3' : 'glass.light2',
  },
}));
