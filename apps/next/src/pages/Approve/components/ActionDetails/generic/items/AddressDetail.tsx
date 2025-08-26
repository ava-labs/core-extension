import { AddressItem } from '@avalabs/vm-module-types';
import { Stack, truncateAddress, Typography } from '@avalabs/k2-alpine';

import { useAccountsContext } from '@core/ui';

import { OverflowingTypography } from '@/components/OverflowingTypography';

import { TxDetailsRow } from './DetailRow';

type AddressDetailProps = {
  item: AddressItem;
};

export const AddressDetail = ({ item }: AddressDetailProps) => {
  const { getAccount } = useAccountsContext();

  const account = getAccount(item.value);

  return (
    <TxDetailsRow label={item.label}>
      <Stack textAlign="right">
        {account && (
          <OverflowingTypography variant="body3" color="text.primary">
            {account.name}
          </OverflowingTypography>
        )}
        <Typography variant="mono" color="text.secondary">
          {truncateAddress(item.value, 10)}
        </Typography>
      </Stack>
    </TxDetailsRow>
  );
};
