import { AddressListItem } from '@avalabs/vm-module-types';
import { Stack } from '@avalabs/k2-alpine';

import { TruncatedAddress } from '@/components/Address';

import { TxDetailsRow } from './DetailRow';

type AddressListDetailProps = {
  item: AddressListItem;
};

export const AddressListDetail = ({ item }: AddressListDetailProps) => {
  return (
    <TxDetailsRow label={item.label}>
      <Stack gap={0.5} textAlign="right">
        {item.value.map((address) => (
          <TruncatedAddress address={address} key={address} />
        ))}
      </Stack>
    </TxDetailsRow>
  );
};
