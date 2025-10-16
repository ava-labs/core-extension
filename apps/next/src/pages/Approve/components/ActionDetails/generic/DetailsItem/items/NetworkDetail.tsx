import { Box, Stack } from '@avalabs/k2-alpine';
import { NetworkItem } from '@avalabs/vm-module-types';

import { OverflowingTypography } from '@/components/OverflowingTypography';

import { TxDetailsRow } from './DetailRow';

type NetworkDetailProps = {
  item: NetworkItem;
};

export const NetworkDetail = ({ item }: NetworkDetailProps) => {
  return (
    <TxDetailsRow label={item.label}>
      <Stack direction="row" alignItems="center" gap={1} textAlign="right">
        <Box
          width={20}
          height={20}
          sx={{
            backgroundImage: `url(${item.value.logoUri})`,
            backgroundSize: 'contain',
          }}
        />
        <OverflowingTypography variant="body3" color="text.primary">
          {item.value.name}
        </OverflowingTypography>
      </Stack>
    </TxDetailsRow>
  );
};
