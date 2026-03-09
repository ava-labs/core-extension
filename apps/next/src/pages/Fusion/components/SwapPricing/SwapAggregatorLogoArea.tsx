import { memoize } from 'lodash';
import { FC, PropsWithChildren } from 'react';
import { Box, getHexAlpha, Theme, useTheme } from '@avalabs/k2-alpine';

type SwapAggregatorLogoAreaProps = PropsWithChildren<{
  size: number;
}>;

const getBoxSx = memoize((theme: Theme) => ({
  backgroundColor: getHexAlpha(theme.palette.primary.main, 10),
  borderRadius: '50%',
}));

export const SwapAggregatorLogoArea: FC<SwapAggregatorLogoAreaProps> = ({
  size,
  children,
}) => {
  const theme = useTheme();

  return (
    <Box
      width={size}
      height={size}
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={getBoxSx(theme)}
    >
      {children}
    </Box>
  );
};
