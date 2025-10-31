import { Typography } from '@avalabs/k2-alpine';
import { Stack } from '@avalabs/k2-alpine';
import { FC } from 'react';

type Props = {
  label: string;
  value: string | React.ReactElement;
};

export const DetailRow: FC<Props> = ({ label, value }) => (
  <Stack
    direction="row"
    gap={1}
    px={2}
    py={0.5}
    minHeight={36}
    alignItems="center"
    justifyContent="space-between"
  >
    <Stack direction="row" alignItems="center" gap={0.5}>
      <Typography variant="body3" sx={{ whiteSpace: 'nowrap' }}>
        {label}
      </Typography>
    </Stack>
    {typeof value === 'string' ? (
      <Typography variant="body3">{value}</Typography>
    ) : (
      value
    )}
  </Stack>
);
