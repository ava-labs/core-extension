import { useMemo } from 'react';
import {
  Box,
  getHexAlpha,
  Stack,
  StackProps,
  styled,
} from '@avalabs/k2-alpine';

type Props = StackProps & {
  current: number;
  total: number;
};

const MAX_DOTS = 5;
const DOT_SIZE = 5;
const DOT_WIDTH_ACTIVE = 15;
const DOT_GAP = 5;
const MAX_WIDTH = (MAX_DOTS - 1) * (DOT_GAP + DOT_SIZE) + DOT_WIDTH_ACTIVE;

export const PageControl = ({ current, total, ...props }: Props) => {
  const dots = useMemo(
    () =>
      Array.from({ length: total }, (_, index) => (
        <Dot key={index} active={index === current} />
      )),
    [current, total],
  );
  const offset = useMemo(() => {
    if (current < MAX_DOTS - 2) {
      return 0;
    }

    return (current - MAX_DOTS + 2) * (DOT_SIZE + DOT_GAP);
  }, [current]);

  return (
    <Stack direction="row" overflow="hidden" width={MAX_WIDTH} {...props}>
      <DotContainer style={{ transform: `translateX(${-offset}px)` }}>
        {dots}
      </DotContainer>
    </Stack>
  );
};

const DotContainer = styled(Stack)({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  transition: 'transform 0.15s ease-in-out',
  gap: DOT_GAP,
});

type DotProps = {
  active: boolean;
};
const Dot = styled(Box, { shouldForwardProp: (p) => p !== 'active' })<DotProps>(
  ({ active, theme }) => ({
    width: active ? DOT_WIDTH_ACTIVE : DOT_SIZE,
    height: DOT_SIZE,
    transition: 'background-color 0.15s ease-in-out, width 0.15s ease-in-out',
    borderRadius: DOT_SIZE,
    backgroundColor: active
      ? theme.palette.primary.main
      : getHexAlpha(theme.palette.primary.main, 40),
  }),
);
