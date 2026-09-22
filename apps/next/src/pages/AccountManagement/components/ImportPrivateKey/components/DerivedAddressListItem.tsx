import {
  AvalancheColorIcon,
  BitcoinColorIcon,
  CircularProgress,
  Stack,
} from '@avalabs/k2-alpine';

import { TruncatedAddress } from '@/components/Address';

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
        <TruncatedAddress
          address={address}
          visibleChars={20}
          color="inherit"
          sx={{ fontSize: '12px', fontFamily: 'DejaVu Sans Mono' }}
        />
        {isLoading && <CircularProgress size={16} />}
      </Stack>
    </Stack>
  );
}
