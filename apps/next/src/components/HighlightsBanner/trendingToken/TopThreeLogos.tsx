import { Avatar, Box } from '@avalabs/k2-alpine';
import { TrendingToken } from '@core/types';

type Props = {
  first: TrendingToken;
  second: TrendingToken;
  third: TrendingToken;
};

export const TopThreeLogos = ({ first, second, third }: Props) => {
  return (
    <Box position="relative" width={60} height={48} flexShrink={0}>
      <Avatar
        src={third.logoURI || undefined}
        alt={third.symbol}
        sx={{
          width: 32,
          height: 32,
          position: 'absolute',
          left: 15,
          top: -10,
          zIndex: 1,
        }}
      />
      <Avatar
        src={second.logoURI || undefined}
        alt={second.symbol}
        sx={{
          width: 20,
          height: 20,
          position: 'absolute',
          left: -2,
          top: 17,
          zIndex: 2,
        }}
      />
      <Avatar
        src={first.logoURI || undefined}
        alt={first.symbol}
        sx={{
          width: 38,
          height: 38,
          position: 'absolute',
          left: 25,
          top: 22,
          zIndex: 3,
        }}
      />
    </Box>
  );
};
