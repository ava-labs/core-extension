import { FC } from 'react';
import { Skeleton, Stack } from '@avalabs/k2-alpine';

export const NotificationListSkeleton: FC = () => (
  <Stack gap={1} py={1}>
    {Array.from({ length: 5 }).map((_, i) => (
      <Skeleton
        key={i}
        variant="rectangular"
        height={45}
        sx={{ borderRadius: 1 }}
      />
    ))}
  </Stack>
);
