import {
  AvalancheColorIcon,
  BitcoinColorIcon,
  CircularProgress,
  Stack,
  Typography,
} from '@avalabs/core-k2-components';
import { truncateAddress, useTheme } from '@avalabs/k2-alpine';

type NetworkType = 'avalanche' | 'bitcoin';

type DerivedAddressProps = {
  networkType: NetworkType;
  address: string;
  isLoading: boolean;
};

export function DerivedAddressListItem({
  networkType,
  address,
  isLoading,
}: DerivedAddressProps) {
  const theme = useTheme();

  const CoinIcon =
    networkType === 'avalanche' ? AvalancheColorIcon : BitcoinColorIcon;

  return (
    <Stack
      direction="row"
      sx={{
        gap: 1,
        py: 1,
        px: 2,
        alignItems: 'center',
        background: theme.palette.grey[850], //TODO check this line
        borderRadius: 1,
        height: 56,
      }}
    >
      <CoinIcon size={18} sx={{ filter: address ? 'none' : 'grayscale(1)' }} />
      <Stack
        direction="row"
        sx={{
          flex: 1,
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography
          variant="body2"
          sx={{ wordBreak: 'break-all', fontFamily: 'DejaVu Sans Mono' }}
        >
          {truncateAddress(address, 17)}
        </Typography>
        {isLoading && <CircularProgress size={16} />}
      </Stack>
    </Stack>
  );
}
