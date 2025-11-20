import { useBridgeState } from '@/pages/Bridge/contexts';
import {
  buttonBaseClasses,
  getHexAlpha,
  IconButton,
  Stack,
  styled,
  SwapIcon,
} from '@avalabs/k2-alpine';
import { FC } from 'react';
import { usePairFlipper } from './usePairFlipper';

export const PairFlipper: FC = () => {
  const { targetToken } = useBridgeState();

  const { flip, canFlip } = usePairFlipper(targetToken);

  return (
    <Stack alignItems="center" justifyContent="center">
      <FlipButton color="secondary" onClick={flip} disabled={!canFlip}>
        <FlipIcon size={20} />
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

const FlipIcon = styled(SwapIcon)({
  transform: 'rotate(90deg) translate(-2px, -2px)',
});
