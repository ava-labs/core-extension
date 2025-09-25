import { Avatar, Box } from '@avalabs/k2-alpine';
import { TrendingToken } from '@core/types';

type Props = {
  first: TrendingToken;
  second: TrendingToken;
  third: TrendingToken;
};

export const TopThreeLogos = ({ first, second, third }: Props) => {
  return (
    <Box
      position="relative"
      width="65px"
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="40px"
    >
      {/* First token - biggest, center-right */}
      <Avatar
        src={first.logoURI || undefined}
        alt={first.symbol}
        sx={{
          width: 38,
          height: 38,
          position: 'absolute',
          right: 0,
          top: '50%',
          transform: 'translateY(calc(-50% + 16px))',
          zIndex: 3,
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
          top: '50%',
          transform: 'translateY(calc(-50% - 4px))',
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
          top: '50%',
          transform: 'translateY(calc(-50% - 24px))',
          // clipPath: 'inset(62.5% 0 0 0)', // Show only bottom half
        }}
      />
    </Box>
  );
};
