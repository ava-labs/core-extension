import {
  AvalancheColorIcon,
  BitcoinColorIcon,
  CircularProgress,
  Stack,
  truncateAddress,
  Typography,
} from '@avalabs/k2-alpine';

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
  const CoinIcon =
    networkType === 'avalanche' ? AvalancheColorIcon : BitcoinColorIcon;

  return (
    <Stack
      direction="row"
      sx={{
        columnGap: '12px',
        px: 2,
        py: '12px',
        alignItems: 'center',
        borderRadius: 1,
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
        <Typography sx={{ fontSize: '12px', fontFamily: 'DejaVu Sans Mono' }}>
          {truncateAddress(address, 20)}
        </Typography>
        {isLoading && <CircularProgress size={16} />}
      </Stack>
    </Stack>
  );
}
