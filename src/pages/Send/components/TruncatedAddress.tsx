import {
  InfoCircleIcon,
  Stack,
  Tooltip,
  Typography,
} from '@avalabs/core-k2-components';
import { truncateAddress } from '@src/utils/truncateAddress';
import type React from 'react';

type TruncatedAddressProps = {
  address?: string;
};

export const TruncatedAddress: React.FC<TruncatedAddressProps> = ({
  address,
}) => (
  <Tooltip
    title={address}
    wrapWithSpan={false}
    placement="top-start"
    componentsProps={{
      tooltip: { sx: { py: 0.75 } },
    }}
  >
    <Stack
      sx={{
        flexDirection: 'row',
        gap: 1,
        alignItems: 'center',
      }}
    >
      <InfoCircleIcon size={16} />
      <Typography variant="caption">
        {truncateAddress(address ?? '')}
      </Typography>
    </Stack>
  </Tooltip>
);
