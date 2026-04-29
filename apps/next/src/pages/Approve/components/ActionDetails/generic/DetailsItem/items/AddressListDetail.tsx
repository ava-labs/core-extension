import { AddressListItem } from '@avalabs/vm-module-types';
import {
  Stack,
  Tooltip,
  truncateAddress,
  Typography,
} from '@avalabs/k2-alpine';

import { TxDetailsRow } from './DetailRow';

type AddressListDetailProps = {
  item: AddressListItem;
};

export const AddressListDetail = ({ item }: AddressListDetailProps) => {
  return (
    <TxDetailsRow label={item.label}>
      <Stack gap={0.5} textAlign="right">
        {item.value.map((address) => (
          <Tooltip title={address} key={address}>
            <Typography variant="mono" color="text.secondary">
              {truncateAddress(address, 10)}
            </Typography>
          </Tooltip>
        ))}
      </Stack>
    </TxDetailsRow>
  );
};
