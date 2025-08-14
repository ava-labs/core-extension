import { Box, Stack, truncateAddress, Typography } from '@avalabs/k2-alpine';

import { AddressType } from '@core/types';

import { Recipient } from '../types';
import { useRecipientName } from '../hooks/useRecipientName';
import { getRecipientAddressByType } from '../lib/getRecipientAddressByType';
import { RecipientIcon } from './RecipientIcon';

type SelectedRecipientProps = {
  recipient: Recipient;
  addressType: AddressType;
};

export const SelectedRecipient = ({
  recipient,
  addressType,
}: SelectedRecipientProps) => {
  const getRecipientName = useRecipientName();

  const name = getRecipientName(recipient);

  const address = getRecipientAddressByType(recipient, addressType);

  return (
    <Stack direction="row" gap={1} alignItems="center">
      <Stack textAlign="end">
        <Typography
          variant="body3"
          color="text.primary"
          fontWeight="fontWeightMedium"
        >
          {name}
        </Typography>
        <Typography variant="mono" color="text.secondary">
          {truncateAddress(address ?? '', 10)}
        </Typography>
      </Stack>
      <Box display="flex" flex={1}>
        <RecipientIcon recipient={recipient} />
      </Box>
    </Stack>
  );
};
