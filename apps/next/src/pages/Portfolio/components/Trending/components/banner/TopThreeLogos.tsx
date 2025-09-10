import { Avatar, Box } from '@avalabs/k2-alpine';
import { TrendingToken } from '@core/types';

type Props = {
  first: TrendingToken;
  second: TrendingToken;
  third: TrendingToken;
};

export const TopThreeLogos = ({ first, second, third }: Props) => {
  return (
    <Box position="relative" width="65px" height="40px">
      {/* First token - biggest, center-right */}
      <Avatar
        src={first.logoURI || undefined}
        alt={first.symbol}
        sx={{
          width: 38,
          height: 38,
          position: 'absolute',
          right: 0,
          top: 17,
          zIndex: 3,
          clipPath: 'inset(0 0 29% 0)', // Cut off bottom portion
        }}
      />

      {/* Second token - smaller, left side */}
      <Avatar
        src={second.logoURI || undefined}
        alt={second.symbol}
        sx={{
          width: 24,
          height: 24,
          position: 'absolute',
          left: 0,
          bottom: 13,
          zIndex: 2,
        }}
      />

      {/* Third token - partial, top-right */}
      <Avatar
        src={third.logoURI || undefined}
        alt={third.symbol}
        sx={{
          width: 32,
          height: 32,
          position: 'absolute',
          right: 5,
          top: -20,
          clipPath: 'inset(62.5% 0 0 0)', // Show only bottom half
        }}
      />
    </Box>
  );
};
