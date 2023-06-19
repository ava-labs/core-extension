import {
  AvalancheColorIcon,
  BitcoinColorIcon,
  CircularProgress,
  Stack,
  Typography,
  useTheme,
} from '@avalabs/k2-components';

export enum NetworkType {
  AVALANCHE = 'avalanche',
  BITCOIN = 'bitcoin',
}

type DerivedAddressProps = {
  networkType: NetworkType;
  address: string;
  isLoading: boolean;
};

export function DerivedAddress({
  networkType,
  address,
  isLoading,
}: DerivedAddressProps) {
  const theme = useTheme();
  const iconStyles = { filter: address ? 'none' : 'grayscale(1)' };

  return (
    <Stack
      direction="row"
      sx={{
        gap: 1,
        py: 1,
        px: 2,
        alignItems: 'center',
        background: theme.palette.grey[850],
        borderRadius: 1,
        height: 56,
      }}
    >
      {networkType === NetworkType.AVALANCHE ? (
        <AvalancheColorIcon size={18} sx={iconStyles} />
      ) : (
        <BitcoinColorIcon size={18} sx={iconStyles} />
      )}
      <Stack
        direction="row"
        sx={{
          flex: 1,
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
          {address}
        </Typography>
        {isLoading && <CircularProgress size={16} />}
      </Stack>
    </Stack>
  );
}
