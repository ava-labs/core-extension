import { useMemo } from 'react';
import {
  Box,
  getHexAlpha,
  Stack,
  StackProps,
  styled,
} from '@avalabs/k2-alpine';

type PageControlSize = 'small' | 'large';
type Props = StackProps & {
  size?: PageControlSize;
  current: number;
  total: number;
};

const MAX_DOTS = 5;
const CONFIG: Record<
  PageControlSize,
  { size: number; activeMultiplier: number }
> = {
  small: { size: 5, activeMultiplier: 3 },
  large: { size: 7, activeMultiplier: 2.5 },
};

const getActiveDotWidth = (size: PageControlSize) => {
  return CONFIG[size].size * CONFIG[size].activeMultiplier;
};

const getMaxWidthForSize = (size: PageControlSize) => {
  const dotSize = CONFIG[size].size;
  return (MAX_DOTS - 1) * (dotSize * 2) + getActiveDotWidth(size);
};

export const PageControl = ({
  current,
  total,
  size = 'small',
  ...props
}: Props) => {
  const dots = useMemo(
    () =>
      Array.from({ length: total }, (_, index) => (
        <Dot key={index} active={index === current} size={size} />
      )),
    [current, total, size],
  );
  const offset = useMemo(() => {
    if (current < MAX_DOTS - 2) {
      return 0;
    }

    return (current - MAX_DOTS + 2) * (CONFIG[size].size * 2);
  }, [current, size]);

  return (
    <Stack
      direction="row"
      overflow="hidden"
      maxWidth={getMaxWidthForSize(size)}
      {...props}
    >
      <DotContainer
        size={size}
        style={{ transform: `translateX(${-offset}px)` }}
      >
        {dots}
      </DotContainer>
    </Stack>
  );
};

const DotContainer = styled(Stack)<{ size: PageControlSize }>(({ size }) => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  transition: 'transform 0.15s ease-in-out',
  gap: CONFIG[size].size,
}));

type DotProps = {
  active: boolean;
  size: PageControlSize;
};
const Dot = styled(Box, {
  shouldForwardProp: (p) => p !== 'active' && p !== 'size',
})<DotProps>(({ active, size, theme }) => ({
  width: active ? getActiveDotWidth(size) : CONFIG[size].size,
  height: CONFIG[size].size,
  transition: 'background-color 0.15s ease-in-out, width 0.15s ease-in-out',
  borderRadius: CONFIG[size].size,
  backgroundColor: active
    ? theme.palette.primary.main
    : getHexAlpha(theme.palette.primary.main, 40),
}));
