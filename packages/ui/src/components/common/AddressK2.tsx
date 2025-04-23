import React from 'react';
import {
  Typography,
  toast,
  CopyIcon,
  Stack,
  IconButton,
  useTheme,
} from '@avalabs/core-k2-components';
import { truncateAddress } from '@core/utils';

interface AddressProps {
  name?: string;
  address: string;
  isTruncated?: boolean;
  className?: string;
  truncateLength?: number;
}

function AddressContentK2({
  name,
  address,
  isTruncated = true,
  truncateLength = 9,
}: AddressProps) {
  const copyAddress = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(address);
    toast.success('Copied!', { duration: 2000 });
  };

  return (
    <>
      {name && (
        <Typography
          height="24px"
          sx={{
            my: 0,
            mr: 1.5,
            ml: 0,
          }}
        >
          {name}
        </Typography>
      )}
      <Stack
        sx={{
          flex: `${name ? 0 : 1}`,
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: 'row',
          width: '100%',
        }}
      >
        <Typography
          variant="body1"
          sx={{
            overflowWrap: 'break-word',
            width: '80%',
          }}
        >
          {isTruncated ? truncateAddress(address, truncateLength) : address}
        </Typography>
        <IconButton size="medium" onClick={copyAddress}>
          <CopyIcon />
        </IconButton>
      </Stack>
    </>
  );
}

export function PrimaryAddressK2(props: AddressProps) {
  const theme = useTheme();

  return (
    <Stack
      sx={{
        background: theme.palette.grey[850],
        px: 2,
        py: 1,
        mb: 5.5,
        borderRadius: `${theme.shape.borderRadius}px`,
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
      className={props.className}
    >
      <AddressContentK2 {...props} />
    </Stack>
  );
}
