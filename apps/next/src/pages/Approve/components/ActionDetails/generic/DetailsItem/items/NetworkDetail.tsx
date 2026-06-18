import { Box, Stack } from '@avalabs/k2-alpine';
import { NetworkItem } from '@avalabs/vm-module-types';

import { OverflowingTypography } from '@/components/OverflowingTypography';

import { TxDetailsRow } from './DetailRow';

type NetworkDetailProps = {
  item: NetworkItem;
};

function safeHttpsUrl(url: string | undefined): string {
  if (!url) return '';
  try {
    const { protocol } = new URL(url);
    return protocol === 'https:' || protocol === 'http:' ? url : '';
  } catch {
    return '';
  }
}

export const NetworkDetail = ({ item }: NetworkDetailProps) => {
  const safeLogoUri = safeHttpsUrl(item.value.logoUri);
  return (
    <TxDetailsRow label={item.label}>
      <Stack direction="row" alignItems="center" gap={1} textAlign="right">
        <Box
          width={20}
          height={20}
          sx={{
            backgroundImage: safeLogoUri ? `url(${safeLogoUri})` : 'none',
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
