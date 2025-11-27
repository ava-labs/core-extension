import { Box, Skeleton, Stack } from '@avalabs/k2-alpine';
import { FC } from 'react';

export const LoadingState: FC = () => {
  return (
    <Stack gap={1.25} height={1} overflow="clip">
      <ActionButtonsSkeleton />
      <TrendingTokensSkeleton />
      <FiltersBarSkeleton />
      <TokensListSkeleton />
    </Stack>
  );
};

const ActionButtonsSkeleton: FC = () => {
  return (
    <Stack direction="row" gap={1}>
      <Skeleton height={60} width={60} animation="wave" variant="rounded" />
      <Skeleton height={60} width={60} animation="wave" variant="rounded" />
      <Skeleton height={60} width={60} animation="wave" variant="rounded" />
      <Skeleton height={60} width={60} animation="wave" variant="rounded" />
    </Stack>
  );
};

const TrendingTokensSkeleton: FC = () => {
  return (
    <Box pt={1.25}>
      <Skeleton height={40} animation="wave" variant="rounded" />
    </Box>
  );
};

const FiltersBarSkeleton: FC = () => {
  return (
    <Stack direction="row" justifyContent="space-between">
      <Stack direction="row" gap={1}>
        <Skeleton width={65} height={24} animation="wave" variant="rounded" />
        <Skeleton width={62} height={24} animation="wave" variant="rounded" />
      </Stack>
      <Skeleton width={70} height={24} animation="wave" variant="rounded" />
    </Stack>
  );
};

const TokensListSkeleton: FC = () => {
  return (
    <Stack gap={1}>
      <Skeleton width="100%" height={50} animation="wave" variant="rounded" />
      <Skeleton width="100%" height={50} animation="wave" variant="rounded" />
      <Skeleton width="100%" height={50} animation="wave" variant="rounded" />
    </Stack>
  );
};
